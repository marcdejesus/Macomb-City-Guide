# core/scraping/attractions_scraper.py
from django.core.files.base import ContentFile
from .base import BaseScraper
import requests
from core.models import Attraction, Category, City
from urllib.parse import urlparse
import re
from geopy.geocoders import Nominatim

class AttractionScraper(BaseScraper):
    """Scraper for attractions data"""
    
    def __init__(self, city_name="Macomb"):
        super().__init__(city_name)
        self.sources = [
            "https://www.tripadvisor.com/Attractions-g42424-Activities-Macomb_Michigan.html",
            "https://www.michigan.org/city/macomb",
            # Add more sources
        ]
        self.geolocator = Nominatim(user_agent="macomb_city_guide")
        
    def scrape_tripadvisor(self, url, max_pages=3):
        """Scrape attraction data from TripAdvisor"""
        attractions = []
        
        for page in range(0, max_pages):
            if page > 0:
                page_url = url.replace(".html", f"-oa{page * 30}.html")
            else:
                page_url = url
                
            soup = self.fetch_page(page_url)
            if not soup:
                continue
                
            attraction_elements = soup.select("div._T.Ci._S")
            
            for element in attraction_elements:
                try:
                    name_elem = element.select_one("div._c")
                    if not name_elem:
                        continue
                        
                    name = self.clean_text(name_elem.text)
                    
                    link_elem = element.select_one("a")
                    if not link_elem or not link_elem.has_attr('href'):
                        continue
                        
                    detail_url = "https://www.tripadvisor.com" + link_elem['href']
                    
                    # Get detailed info from attraction page
                    attraction_data = self.scrape_attraction_detail(detail_url)
                    if attraction_data:
                        attraction_data.update({
                            'name': name,
                        })
                        attractions.append(attraction_data)
                        self.log_progress(f"Scraped attraction", name)
                except Exception as e:
                    self.log_progress(f"Error scraping attraction: {str(e)}")
        
        return attractions
        
    def scrape_attraction_detail(self, url):
        """Scrape detailed attraction info from its page"""
        soup = self.fetch_page(url)
        if not soup:
            return None
            
        try:
            # Extract category
            category_elem = soup.select_one("div.eHSEQ a")
            category = self.clean_text(category_elem.text) if category_elem else "Attraction"
            
            # Extract description
            description_elem = soup.select_one("div._d")
            description = self.clean_text(description_elem.text) if description_elem else ""
            
            # Extract address
            address_elem = soup.select_one("button.UikNM")
            address = self.clean_text(address_elem.text) if address_elem else ""
            
            # Extract website if available
            website = ""
            website_elem = soup.select_one("a.YnKZo._F.Gi.Gi2.GA")
            if website_elem and website_elem.has_attr('href'):
                website = website_elem['href']
                # TripAdvisor redirects, get the actual URL
                if "tripadvisor.com/Commerce" in website:
                    redirect_param = re.search(r'url=([^&]+)', website)
                    if redirect_param:
                        website = redirect_param.group(1)
            
            # Extract hours
            hours_text = "Hours not available"
            hours_elem = soup.select_one("div.opDsW")
            if hours_elem:
                hours_text = self.clean_text(hours_elem.text)
            
            # Extract image
            image_url = ""
            image_elem = soup.select_one("div.TRFEE img")
            if image_elem and image_elem.has_attr('src'):
                image_url = image_elem['src']
            
            return {
                'category': category,
                'description': description,
                'address': address,
                'image_url': image_url,
                'opening_hours': hours_text,
                'website': website
            }
        except Exception as e:
            self.log_progress(f"Error scraping attraction detail: {str(e)}")
            return None
    
    def get_coordinates(self, address):
        """Get latitude and longitude from address"""
        if not address:
            return None, None
            
        try:
            location = self.geolocator.geocode(address)
            if location:
                return location.latitude, location.longitude
        except Exception as e:
            self.log_progress(f"Error getting coordinates for {address}: {str(e)}")
        
        return None, None
    
    def save_to_database(self, attraction_data):
        """Save scraped attraction data to database"""
        # Use the base class method instead of direct get_or_create
        city = self.get_city(self.city_name)
        
        # Rest remains the same
        for data in attraction_data:
            try:
                # Get or create category
                category, _ = Category.objects.get_or_create(name=data['category'])
                
                # Get coordinates
                latitude, longitude = self.get_coordinates(f"{data['address']}, {self.city_name}, MI")
                
                # Check if attraction already exists
                attraction, created = Attraction.objects.get_or_create(
                    name=data['name'], 
                    address=data['address'],
                    defaults={
                        'description': data['description'],
                        'category': category,
                        'opening_hours': data['opening_hours'],
                        'website': data['website'],
                        'latitude': latitude,
                        'longitude': longitude,
                        'city': city
                    }
                )
                
                # Update image if it's a new attraction or doesn't have an image
                if created or not attraction.image:
                    self.download_and_save_image(attraction, data['image_url'])
                    
                self.log_progress(f"{'Created' if created else 'Updated'} attraction", attraction.name)
            except Exception as e:
                self.log_progress(f"Error saving attraction {data['name']}: {str(e)}")
    
    def download_and_save_image(self, attraction, image_url):
        """Download and save attraction image"""
        if not image_url:
            return
            
        try:
            response = requests.get(image_url, stream=True, timeout=30)
            if response.status_code == 200:
                # Generate filename from URL
                filename = urlparse(image_url).path.split('/')[-1]
                if not filename or '.' not in filename:
                    filename = f"attraction_{attraction.id}.jpg"
                    
                attraction.image.save(filename, ContentFile(response.content), save=True)
                self.log_progress(f"Saved image for attraction", attraction.name)
        except Exception as e:
            self.log_progress(f"Error downloading image: {str(e)}")
    
    def run(self):
        """Run the attraction scraper"""
        self.log_progress("Starting attraction scraper")
        
        all_attraction_data = []
        
        # Scrape from TripAdvisor
        tripadvisor_data = self.scrape_tripadvisor(self.sources[0])
        all_attraction_data.extend(tripadvisor_data)
        
        # Add more sources if needed
        
        # Save to database
        self.save_to_database(all_attraction_data)
        
        self.log_progress(f"Completed attraction scraper, scraped {len(all_attraction_data)} attractions")