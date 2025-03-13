# core/scraping/events_scraper.py
from django.core.files.base import ContentFile
from .base import BaseScraper
from core.models import Event, EventType, City
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from datetime import datetime
import re

class EventScraper(BaseScraper):
    """Scraper for events data"""
    
    def __init__(self, city_name="Macomb"):
        super().__init__(city_name)
        self.sources = [
            "https://www.eventbrite.com/d/mi--macomb/all-events/",
            "https://www.macomb-mi.gov/Calendar.aspx",
            # Add more sources
        ]
    
    def scrape_eventbrite(self, url):
        """Scrape event data from Eventbrite"""
        events = []
        
        soup = self.fetch_page(url)
        if not soup:
            return events
            
        event_elements = soup.select("div.discover-search-desktop-card")
        
        for element in event_elements:
            try:
                # Extract event name
                name_elem = element.select_one("div.eds-is-hidden-accessible")
                if not name_elem:
                    continue
                    
                name = self.clean_text(name_elem.text)
                
                # Extract event link
                link_elem = element.select_one("a.eds-event-card-content__action-link")
                if not link_elem or not link_elem.has_attr('href'):
                    continue
                    
                detail_url = link_elem['href']
                
                # Extract date and time
                date_elem = element.select_one("div.eds-event-card-content__sub-title")
                date_time_str = self.clean_text(date_elem.text) if date_elem else ""
                
                # Extract location
                location_elem = element.select_one("div.card-text--truncated__one")
                location = self.clean_text(location_elem.text) if location_elem else ""
                
                # Extract image
                image_elem = element.select_one("img.eds-event-card-content__image")
                image_url = image_elem['src'] if image_elem and image_elem.has_attr('src') else ""
                
                # Get detailed info from event page
                event_data = self.scrape_event_detail(detail_url)
                
                if event_data:
                    # Parse date and time
                    date_obj, time_obj = self.parse_date_time(date_time_str)
                    
                    event_data.update({
                        'name': name,
                        'venue': location,
                        'date': date_obj,
                        'time': time_obj,
                        'address': location,  # Will be updated with full address from detail page if available
                        'image_url': image_url
                    })
                    events.append(event_data)
                    self.log_progress(f"Scraped event", name)
            except Exception as e:
                self.log_progress(f"Error scraping event: {str(e)}")
        
        return events
    
    def parse_date_time(self, date_time_str):
        """Parse date and time from a string like 'Fri, Apr 5, 7:00 PM'"""
        date_obj = datetime.now().date()
        time_obj = datetime.now().time()
        
        try:
            # Try different date formats
            formats_to_try = [
                '%a, %b %d, %I:%M %p',
                '%a, %b %d, %Y, %I:%M %p',
                '%B %d, %Y %I:%M %p',
                '%Y-%m-%d %H:%M:%S'
            ]
            
            for fmt in formats_to_try:
                try:
                    dt = datetime.strptime(date_time_str, fmt)
                    date_obj = dt.date()
                    time_obj = dt.time()
                    break
                except ValueError:
                    continue
        except Exception as e:
            self.log_progress(f"Error parsing date/time '{date_time_str}': {str(e)}")
        
        return date_obj, time_obj
    
    def scrape_event_detail(self, url):
        """Scrape detailed event info from its page"""
        soup = self.fetch_page(url)
        if not soup:
            return None
            
        try:
            # Extract description
            description_elem = soup.select_one("div[data-testid='listing-description']")
            description = self.clean_text(description_elem.text) if description_elem else ""
            
            # Extract full address
            address_elem = soup.select_one("div[data-testid='listing-map-card'] p")
            address = self.clean_text(address_elem.text) if address_elem else ""
            
            # Extract event type/category
            event_type = "Community"  # Default
            type_elem = soup.select_one("a[data-testid='listing-breadcrumb']")
            if type_elem:
                event_type = self.clean_text(type_elem.text)
            
            # Extract website
            website = url
            
            return {
                'description': description,
                'event_type': event_type,
                'address': address,
                'website': website
            }
        except Exception as e:
            self.log_progress(f"Error scraping event detail: {str(e)}")
            return None
    
    def save_to_database(self, event_data):
        """Save scraped event data to database"""
        # Use the base class method instead of direct get_or_create
        city = self.get_city(self.city_name)
        
        # Rest remains the same
        for data in event_data:
            try:
                # Get or create event type
                event_type, _ = EventType.objects.get_or_create(name=data['event_type'])
                
                # Check if event already exists
                event, created = Event.objects.get_or_create(
                    name=data['name'], 
                    date=data['date'],
                    time=data['time'],
                    defaults={
                        'description': data['description'],
                        'event_type': event_type,
                        'venue': data['venue'],
                        'address': data['address'],
                        'website': data['website'],
                        'city': city
                    }
                )
                
                # Update image if it's a new event or doesn't have an image
                if created or not event.image:
                    self.download_and_save_image(event, data['image_url'])
                    
                self.log_progress(f"{'Created' if created else 'Updated'} event", event.name)
            except Exception as e:
                self.log_progress(f"Error saving event {data['name']}: {str(e)}")
    
    def download_and_save_image(self, event, image_url):
        """Download and save event image"""
        if not image_url:
            return
            
        try:
            response = requests.get(image_url, stream=True, timeout=30)
            if response.status_code == 200:
                # Generate filename from URL
                filename = urlparse(image_url).path.split('/')[-1]
                if not filename or '.' not in filename:
                    filename = f"event_{event.id}.jpg"
                    
                event.image.save(filename, ContentFile(response.content), save=True)
                self.log_progress(f"Saved image for event", event.name)
        except Exception as e:
            self.log_progress(f"Error downloading image: {str(e)}")
    
    def run(self):
        """Run the event scraper"""
        self.log_progress("Starting event scraper")
        
        all_event_data = []
        
        # Scrape from Eventbrite
        eventbrite_data = self.scrape_eventbrite(self.sources[0])
        all_event_data.extend(eventbrite_data)
        
        # Add more sources if needed
        
        # Save to database
        self.save_to_database(all_event_data)
        
        self.log_progress(f"Completed event scraper, scraped {len(all_event_data)} events")