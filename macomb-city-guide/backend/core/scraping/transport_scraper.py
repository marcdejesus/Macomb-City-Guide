from django.core.files.base import ContentFile
from .base import BaseScraper
from core.models import TransportType, TransportOption, City
import requests
import re
from urllib.parse import urlparse
import json

class TransportScraper(BaseScraper):
    """Scraper for transportation data"""
    
    def __init__(self, city_name="Macomb"):
        super().__init__(city_name)
        self.sources = {
            'bus': "https://www.smartbus.org/Schedules/Route-Schedules",
            'parking': "https://www.macombgov.org/Parking",
            'taxi': "https://www.yellowpages.com/macomb-mi/taxis"
        }
        
    def scrape_bus_schedules(self, url):
        """Scrape bus route information"""
        transport_data = []
        soup = self.fetch_page(url)
        if not soup:
            return transport_data
            
        try:
            # Find the route links and info
            route_elements = soup.select('.route-name')
            for route_elem in route_elements:
                try:
                    route_name = self.clean_text(route_elem.text)
                    route_link = route_elem.select_one('a')
                    if not route_link or 'href' not in route_link.attrs:
                        continue
                        
                    route_url = self.normalize_url(route_link['href'], url)
                    
                    # Get route details
                    route_details = self.scrape_route_detail(route_url)
                    if route_details:
                        route_data = {
                            'name': f"SMART Bus Route {route_name}",
                            'description': f"Bus service on route {route_name} through Macomb County.",
                            'routes': route_name,
                            'transport_type': 'Public Transit',
                            'image_url': route_details.get('image_url', ''),
                            'schedule': route_details.get('schedule', ''),
                            'website': route_url
                        }
                        transport_data.append(route_data)
                        self.log_progress(f"Scraped bus route", route_name)
                        
                except Exception as e:
                    self.log_progress(f"Error processing bus route: {str(e)}")
            
        except Exception as e:
            self.log_progress(f"Error scraping bus schedules: {str(e)}")
            
        return transport_data
    
    def scrape_route_detail(self, url):
        """Scrape detailed bus route information"""
        soup = self.fetch_page(url)
        if not soup:
            return None
            
        try:
            # Schedule information - look for tables with times
            schedule_text = []
            schedule_tables = soup.select('table.schedule-table')
            for table in schedule_tables:
                direction = table.select_one('caption')
                direction_text = self.clean_text(direction.text) if direction else "Schedule"
                schedule_text.append(direction_text)
                
                # Process schedule rows
                rows = []
                for tr in table.select('tr'):
                    row_cells = [self.clean_text(td.text) for td in tr.select('td, th')]
                    if row_cells:
                        rows.append(' | '.join(row_cells))
                        
                if rows:
                    schedule_text.append('\n'.join(rows))
            
            # Get route map image if available
            image_url = ""
            map_image = soup.select_one('img.route-map-img')
            if map_image and 'src' in map_image.attrs:
                image_url = self.normalize_url(map_image['src'], url)
            
            return {
                'schedule': '\n\n'.join(schedule_text),
                'image_url': image_url
            }
            
        except Exception as e:
            self.log_progress(f"Error scraping route detail: {str(e)}")
            return None
    
    def scrape_parking_facilities(self, url):
        """Scrape parking facility information"""
        transport_data = []
        soup = self.fetch_page(url)
        if not soup:
            return transport_data
            
        try:
            # Find parking information sections
            parking_sections = soup.select('.parking-info, .parking-facilities')
            if not parking_sections:
                # If specific classes not found, try to find parking-related content
                parking_sections = soup.select('div:contains("Parking")')
            
            for section in parking_sections:
                try:
                    facility_name_elem = section.select_one('h3, h4, .facility-name')
                    facility_name = self.clean_text(facility_name_elem.text) if facility_name_elem else "Downtown Parking"
                    
                    address_elem = section.select_one('address, .address')
                    address = self.clean_text(address_elem.text) if address_elem else "Macomb County, MI"
                    
                    description_elem = section.select_one('p, .description')
                    description = self.clean_text(description_elem.text) if description_elem else "Parking facility in Macomb County."
                    
                    # Create parking facility data
                    facility_data = {
                        'name': facility_name,
                        'description': description,
                        'address': address,
                        'transport_type': 'Parking',
                        'image_url': '',  # Usually no images available on these pages
                        'schedule': 'Open 24/7',  # Default value
                        'website': url
                    }
                    
                    transport_data.append(facility_data)
                    self.log_progress(f"Scraped parking facility", facility_name)
                    
                except Exception as e:
                    self.log_progress(f"Error processing parking section: {str(e)}")
            
            # If no facilities found through specific elements, create a generic one
            if not transport_data:
                transport_data.append({
                    'name': 'Macomb County Parking',
                    'description': 'Public parking facilities throughout Macomb County.',
                    'address': 'Macomb County, MI',
                    'transport_type': 'Parking',
                    'image_url': '',
                    'schedule': 'Hours vary by location. Most facilities open 24/7.',
                    'website': url
                })
                
        except Exception as e:
            self.log_progress(f"Error scraping parking facilities: {str(e)}")
            
        return transport_data
    
    def scrape_taxi_services(self, url):
        """Scrape taxi and rideshare service information"""
        transport_data = []
        soup = self.fetch_page(url)
        if not soup:
            return transport_data
            
        try:
            # Find taxi listings
            listings = soup.select('.listing, .result')
            for listing in listings:
                try:
                    name_elem = listing.select_one('.business-name, .company-name, h3 a')
                    name = self.clean_text(name_elem.text) if name_elem else "Local Taxi Service"
                    
                    # Skip if it doesn't look like a taxi service
                    if 'taxi' not in name.lower() and 'cab' not in name.lower() and 'transportation' not in name.lower():
                        continue
                    
                    phone_elem = listing.select_one('.phones, .phone-number')
                    phone = self.clean_text(phone_elem.text) if phone_elem else "Call for availability"
                    
                    address_elem = listing.select_one('.address, .street-address')
                    address = self.clean_text(address_elem.text) if address_elem else "Macomb County, MI"
                    
                    website_elem = listing.select_one('a.website')
                    website = website_elem['href'] if website_elem and 'href' in website_elem.attrs else ""
                    
                    # Create taxi service data
                    service_data = {
                        'name': name,
                        'description': f"{name} provides taxi services in the Macomb County area.",
                        'address': address,
                        'transport_type': 'Taxi & Rideshare',
                        'image_url': '',  # Usually no images in these listings
                        'schedule': f"24/7 service available. Contact: {phone}",
                        'website': website
                    }
                    
                    transport_data.append(service_data)
                    self.log_progress(f"Scraped taxi service", name)
                    
                except Exception as e:
                    self.log_progress(f"Error processing taxi listing: {str(e)}")
            
            # Add standard rideshare services if no taxis found or as additions
            if len(transport_data) < 3:
                standard_services = [
                    {
                        'name': 'Uber',
                        'description': 'Rideshare service available throughout Macomb County via mobile app.',
                        'address': 'Serving all of Macomb County, MI',
                        'transport_type': 'Taxi & Rideshare',
                        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/800px-Uber_logo_2018.png',
                        'schedule': '24/7 service via mobile app. Availability depends on drivers.',
                        'website': 'https://www.uber.com'
                    },
                    {
                        'name': 'Lyft',
                        'description': 'Rideshare platform offering on-demand transportation services.',
                        'address': 'Serving all of Macomb County, MI',
                        'transport_type': 'Taxi & Rideshare',
                        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Lyft_logo.svg/800px-Lyft_logo.svg.png',
                        'schedule': '24/7 service via mobile app. Availability depends on drivers.',
                        'website': 'https://www.lyft.com'
                    }
                ]
                transport_data.extend(standard_services)
                
        except Exception as e:
            self.log_progress(f"Error scraping taxi services: {str(e)}")
            
        return transport_data
    
    def save_to_database(self, transport_data):
        """Save scraped transportation data to database"""
        # Use the base class method instead of direct get_or_create
        city = self.get_city(self.city_name)
        
        # Rest remains the same
        for data in transport_data:
            try:
                # Get or create transport type
                transport_type, _ = TransportType.objects.get_or_create(
                    name=data['transport_type']
                )
                
                # Check if transport option already exists
                option, created = TransportOption.objects.get_or_create(
                    name=data['name'],
                    defaults={
                        'description': data['description'],
                        'transport_type': transport_type,
                        'routes': data.get('routes', ''),
                        'schedule': data.get('schedule', ''),
                        'website': data.get('website', ''),
                        'city': city
                    }
                )
                
                # Update existing option if needed
                if not created:
                    option.description = data['description']
                    option.transport_type = transport_type
                    option.routes = data.get('routes', '')
                    option.schedule = data.get('schedule', '')
                    option.website = data.get('website', '')
                    option.save()
                
                # Download and save image if available and needed
                if (created or not option.image) and data.get('image_url'):
                    self.download_and_save_image(option, data['image_url'])
                
                self.log_progress(f"{'Created' if created else 'Updated'} transport option", option.name)
            except Exception as e:
                self.log_progress(f"Error saving transport option {data.get('name', 'unknown')}: {str(e)}")
    
    def download_and_save_image(self, transport_option, image_url):
        """Download and save transport option image"""
        try:
            image_content = self.download_image(image_url)
            if not image_content:
                return False
                
            file_name = f"transport_{transport_option.id}_{urlparse(image_url).path.split('/')[-1]}"
            transport_option.image.save(file_name, ContentFile(image_content), save=True)
            return True
        except Exception as e:
            self.log_progress(f"Error saving image for {transport_option.name}: {str(e)}")
            return False
    
    def run(self):
        """Run the transportation scraper"""
        self.log_progress("Starting transportation scraper")
        
        all_transport_data = []
        
        # Scrape bus schedules
        bus_data = self.scrape_bus_schedules(self.sources['bus'])
        all_transport_data.extend(bus_data)
        
        # Scrape parking facilities
        parking_data = self.scrape_parking_facilities(self.sources['parking'])
        all_transport_data.extend(parking_data)
        
        # Scrape taxi services
        taxi_data = self.scrape_taxi_services(self.sources['taxi'])
        all_transport_data.extend(taxi_data)
        
        # Save to database
        self.save_to_database(all_transport_data)
        
        self.log_progress(f"Completed transportation scraper, scraped {len(all_transport_data)} transport options")