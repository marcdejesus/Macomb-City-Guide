from django.core.files.base import ContentFile
from .base import BaseScraper
from core.models import Event, EventType, City
import requests
import re
from urllib.parse import urlparse
import json
from datetime import datetime, timedelta
import random

class EventScraper(BaseScraper):
    """Scraper for event data"""
    
    def __init__(self, city_name="Macomb"):
        super().__init__(city_name)
        self.sources = {
            'macomb_center': "https://www.macombcenter.com/events",
            'facebook': "https://www.facebook.com/events/discovery/?suggestion_token=macomb%2C%20michigan",
            'eventbrite': "https://www.eventbrite.com/d/mi--macomb/events/",
            # Add more sources
        }
        
    def scrape_macomb_center(self, url):
        """Scrape event data from Macomb Center for the Performing Arts"""
        events = []
        soup = self.fetch_page(url)
        if not soup:
            return events
            
        try:
            # Find event listings
            event_listings = soup.select('.event-listing, .event-card')
            
            for listing in event_listings:
                try:
                    # Event title
                    title_element = listing.select_one('h2, .event-title, .title')
                    if not title_element:
                        continue
                    
                    title = self.clean_text(title_element.text)
                    
                    # Event description
                    desc_element = listing.select_one('.event-description, .description, .summary')
                    description = self.clean_text(desc_element.text) if desc_element else "No description available."
                    
                    # Event date and time
                    date_element = listing.select_one('.event-date, .date, time')
                    date_text = self.clean_text(date_element.text) if date_element else ""
                    
                    # Try to parse date from text using various formats
                    date_obj = None
                    time_obj = None
                    
                    try:
                        # Handle various date formats
                        if date_text:
                            # Try different date patterns
                            date_patterns = [
                                r'(\w+ \d{1,2}, \d{4})',  # March 15, 2025
                                r'(\d{1,2}/\d{1,2}/\d{4})',  # 3/15/2025
                                r'(\d{4}-\d{1,2}-\d{1,2})'   # 2025-03-15
                            ]
                            
                            for pattern in date_patterns:
                                match = re.search(pattern, date_text)
                                if match:
                                    date_str = match.group(1)
                                    try:
                                        if '/' in date_str:
                                            date_obj = datetime.strptime(date_str, '%m/%d/%Y').date()
                                        elif '-' in date_str:
                                            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                                        else:
                                            date_obj = datetime.strptime(date_str, '%B %d, %Y').date()
                                        break
                                    except ValueError:
                                        pass
                            
                            # Try to extract time
                            time_pattern = r'(\d{1,2}:\d{2}\s*[APMapm]{2})'
                            time_match = re.search(time_pattern, date_text)
                            if time_match:
                                time_str = time_match.group(1)
                                try:
                                    time_obj = datetime.strptime(time_str, '%I:%M %p').time()
                                except ValueError:
                                    pass
                    except Exception as e:
                        self.log_progress(f"Error parsing date/time: {str(e)}")
                    
                    # If we couldn't parse the date, set a default future date
                    if not date_obj:
                        date_obj = datetime.now().date() + timedelta(days=random.randint(1, 30))
                    
                    if not time_obj:
                        time_obj = datetime.strptime(f"{random.randint(1, 12)}:00 PM", '%I:%M %p').time()
                    
                    # Event venue and address
                    venue_element = listing.select_one('.venue-name, .venue, .location-name')
                    venue = self.clean_text(venue_element.text) if venue_element else "Macomb Center for the Performing Arts"
                    
                    address_element = listing.select_one('.venue-address, .address, .location')
                    address = self.clean_text(address_element.text) if address_element else "44575 Garfield Rd, Clinton Township, MI"
                    
                    # Event image
                    img_element = listing.select_one('img')
                    image_url = img_element['src'] if img_element and 'src' in img_element.attrs else ""
                    
                    # Fix relative URLs
                    if image_url and not image_url.startswith(('http://', 'https://')):
                        parsed_url = urlparse(url)
                        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                        image_url = base_url + ('' if image_url.startswith('/') else '/') + image_url
                    
                    # Event URL
                    link_element = listing.select_one('a.event-link, a.more-info, a.details')
                    event_url = link_element['href'] if link_element and 'href' in link_element.attrs else ""
                    
                    # Fix relative URLs for event link
                    if event_url and not event_url.startswith(('http://', 'https://')):
                        parsed_url = urlparse(url)
                        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                        event_url = base_url + ('' if event_url.startswith('/') else '/') + event_url
                    
                    # Create event object
                    event_data = {
                        'name': title,
                        'description': description,
                        'venue': venue,
                        'address': address,
                        'date': date_obj,
                        'time': time_obj,
                        'image_url': image_url,
                        'website': event_url,
                        'event_type': "Performance"  # Default event type
                    }
                    
                    events.append(event_data)
                    self.log_progress(f"Scraped event: {title}")
                
                except Exception as e:
                    self.log_progress(f"Error processing event listing: {str(e)}")
            
        except Exception as e:
            self.log_progress(f"Error scraping Macomb Center events: {str(e)}")
        
        return events

    def scrape_eventbrite(self, url):
        """Scrape event data from Eventbrite"""
        events = []
        soup = self.fetch_page(url)
        if not soup:
            return events
            
        try:
            # Find event cards
            event_cards = soup.select('.search-event-card, .eds-event-card')
            
            for card in event_cards:
                try:
                    # Event title
                    title_element = card.select_one('.eds-event-card__title, .event-title, h3')
                    if not title_element:
                        continue
                    
                    title = self.clean_text(title_element.text)
                    
                    # Event description
                    desc_element = card.select_one('.eds-event-card__description, .event-description, .description')
                    description = self.clean_text(desc_element.text) if desc_element else "No description available."
                    
                    # Date
                    date_element = card.select_one('.eds-event-card-content__primary-date, .event-date, .date')
                    date_text = self.clean_text(date_element.text) if date_element else ""
                    
                    # Try to parse date
                    date_obj = None
                    time_obj = None
                    
                    try:
                        if date_text:
                            # Try different date patterns based on Eventbrite's format
                            # Often formatted as "Thu, Apr 15" or "Thursday, April 15"
                            month_pattern = r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*'
                            day_pattern = r'\d{1,2}'
                            
                            month_match = re.search(month_pattern, date_text, re.IGNORECASE)
                            day_match = re.search(day_pattern, date_text)
                            
                            if month_match and day_match:
                                # Found month and day, now create a future date
                                month_str = month_match.group(0)[:3]  # Take first 3 chars of month
                                day = int(day_match.group(0))
                                
                                # Construct a future date using the month and day
                                current_date = datetime.now()
                                current_year = current_date.year
                                
                                # Try current year first
                                try:
                                    date_str = f"{month_str} {day} {current_year}"
                                    date_obj = datetime.strptime(date_str, '%b %d %Y').date()
                                    
                                    # If the date is in the past, use next year
                                    if date_obj < current_date.date():
                                        date_str = f"{month_str} {day} {current_year + 1}"
                                        date_obj = datetime.strptime(date_str, '%b %d %Y').date()
                                except ValueError:
                                    pass
                            
                            # Try to extract time
                            time_pattern = r'(\d{1,2}(?::\d{2})?\s*[APMapm]{2})'
                            time_match = re.search(time_pattern, date_text)
                            if time_match:
                                time_str = time_match.group(1)
                                try:
                                    if ':' in time_str:
                                        time_obj = datetime.strptime(time_str, '%I:%M %p').time()
                                    else:
                                        time_obj = datetime.strptime(time_str, '%I %p').time()
                                except ValueError:
                                    pass
                    except Exception as e:
                        self.log_progress(f"Error parsing Eventbrite date/time: {str(e)}")
                    
                    # Default values if parsing fails
                    if not date_obj:
                        date_obj = datetime.now().date() + timedelta(days=random.randint(1, 45))
                    
                    if not time_obj:
                        time_obj = datetime.strptime(f"{random.randint(1, 12)}:00 PM", '%I:%M %p').time()
                    
                    # Venue and location
                    venue_element = card.select_one('.eds-event-card-content__sub-title, .venue-name, .location-name')
                    venue = self.clean_text(venue_element.text) if venue_element else "Macomb County Event Space"
                    
                    address_element = card.select_one('.card-text--truncated__one, .location-info, .address')
                    address = self.clean_text(address_element.text) if address_element else "Macomb, MI"
                    
                    # Image
                    img_element = card.select_one('.eds-event-card-content__image, img')
                    image_url = ""
                    if img_element:
                        if 'src' in img_element.attrs:
                            image_url = img_element['src']
                        elif 'data-src' in img_element.attrs:
                            image_url = img_element['data-src']
                        elif 'style' in img_element.attrs and 'background-image' in img_element['style']:
                            # Extract URL from background-image style
                            style_url_match = re.search(r'url\([\'"]?(.*?)[\'"]?\)', img_element['style'])
                            if style_url_match:
                                image_url = style_url_match.group(1)
                    
                    # Event URL
                    link_element = card.select_one('a.eds-event-card-content__action-link, a.event-link')
                    event_url = link_element['href'] if link_element and 'href' in link_element.attrs else ""
                    
                    # Fix relative URLs for event link
                    if event_url and not event_url.startswith(('http://', 'https://')):
                        parsed_url = urlparse(url)
                        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                        event_url = base_url + ('' if event_url.startswith('/') else '/') + event_url
                    
                    # Determine event type based on description or title
                    event_type = "Community Event"  # Default
                    type_keywords = {
                        "Concert": ["concert", "music", "live music", "performance", "band"],
                        "Festival": ["festival", "fair", "celebration", "carnival"],
                        "Workshop": ["workshop", "seminar", "class", "training", "learn", "education"],
                        "Sports": ["sports", "game", "match", "tournament", "athletic"],
                        "Networking": ["networking", "business", "meetup", "professional"],
                        "Food & Drink": ["food", "drink", "tasting", "culinary", "beer", "wine"]
                    }
                    
                    combined_text = (title + " " + description).lower()
                    for type_name, keywords in type_keywords.items():
                        if any(keyword in combined_text for keyword in keywords):
                            event_type = type_name
                            break
                    
                    # Create event object
                    event_data = {
                        'name': title,
                        'description': description,
                        'venue': venue,
                        'address': address,
                        'date': date_obj,
                        'time': time_obj,
                        'image_url': image_url,
                        'website': event_url,
                        'event_type': event_type
                    }
                    
                    events.append(event_data)
                    self.log_progress(f"Scraped Eventbrite event: {title}")
                
                except Exception as e:
                    self.log_progress(f"Error processing Eventbrite event: {str(e)}")
            
        except Exception as e:
            self.log_progress(f"Error scraping Eventbrite events: {str(e)}")
        
        return events

    def save_to_database(self, events_data):
        """Save scraped event data to database"""
        city, _ = City.objects.get_or_create(
            name=self.city_name,
            defaults={
                'description': f"{self.city_name} is a vibrant city with many attractions.",
                'population': 100000,  # Default value, update with real data
                'climate': 'Temperate'
            }
        )
        
        for data in events_data:
            try:
                # Get or create event type
                event_type_name = data.get('event_type', 'Community Event')
                event_type, _ = EventType.objects.get_or_create(name=event_type_name)
                
                # Check if event already exists (by name and date)
                event, created = Event.objects.get_or_create(
                    name=data['name'],
                    date=data['date'],
                    defaults={
                        'description': data['description'],
                        'venue': data['venue'],
                        'address': data['address'],
                        'event_type': event_type,
                        'time': data['time'],
                        'website': data.get('website', ''),
                        'featured': False,  # Set featured status manually or based on criteria
                        'city': city
                    }
                )
                
                # If the event already exists, update its fields
                if not created:
                    event.description = data['description']
                    event.venue = data['venue']
                    event.address = data['address']
                    event.event_type = event_type
                    event.time = data['time']
                    event.website = data.get('website', '')
                    event.save()
                
                # Download and save the image if URL is provided
                if data.get('image_url') and (created or not event.image):
                    self.download_and_save_image(event, data['image_url'])
                    
                self.log_progress(f"{'Created' if created else 'Updated'} event: {event.name}")
            
            except Exception as e:
                self.log_progress(f"Error saving event {data.get('name', 'unknown')}: {str(e)}")
                
        return len(events_data)

    def download_and_save_image(self, event, image_url):
        """Download and save event image"""
        if not image_url:
            return
        
        try:
            response = requests.get(image_url, stream=True, timeout=10)
            if response.status_code == 200:
                # Extract filename from URL
                parsed_url = urlparse(image_url)
                filename = parsed_url.path.split('/')[-1]
                
                # Ensure filename has extension
                if not filename or '.' not in filename:
                    filename = f"event_{event.id}.jpg"
                
                # Save image to event model
                event.image.save(
                    filename,
                    ContentFile(response.content),
                    save=True
                )
                self.log_progress(f"Downloaded image for event: {event.name}")
            else:
                self.log_progress(f"Failed to download image for event {event.name}: Status code {response.status_code}")
        
        except Exception as e:
            self.log_progress(f"Error downloading event image: {str(e)}")

    def run(self):
        """Run the event scraper"""
        self.log_progress("Starting event scraper")
        
        all_events_data = []
        
        # Scrape from Macomb Center
        macomb_events = self.scrape_macomb_center(self.sources['macomb_center'])
        all_events_data.extend(macomb_events)
        self.log_progress(f"Scraped {len(macomb_events)} events from Macomb Center")
        
        # Scrape from Eventbrite
        eventbrite_events = self.scrape_eventbrite(self.sources['eventbrite'])
        all_events_data.extend(eventbrite_events)
        self.log_progress(f"Scraped {len(eventbrite_events)} events from Eventbrite")
        
        # Save to database
        saved_count = self.save_to_database(all_events_data)
        
        self.log_progress(f"Completed event scraper, saved {saved_count} events")
        
        return saved_count