# core/scraping/property_scraper.py
import json
import re
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from django.core.files.base import ContentFile
from geopy.geocoders import Nominatim

from .base import BaseScraper
from core.models import Property, PropertyType, City, PropertyImage

class PropertyScraper(BaseScraper):
    """Scraper for real estate property data"""
    
    def __init__(self, city_name="Macomb"):
        super().__init__(city_name)
        self.sources = [
            "https://www.zillow.com/macomb-mi/",
            "https://www.realtor.com/realestateandhomes-search/Macomb_MI",
            # Add more sources
        ]
        self.geolocator = Nominatim(user_agent="macomb_city_guide")
        
    def scrape_zillow(self, url, for_sale=True):
        """Scrape property data from Zillow"""
        properties = []
        
        search_url = f"{url}{'for_sale/' if for_sale else 'for_rent/'}"
        soup = self.fetch_page(search_url, javascript_required=True)
        if not soup:
            return properties
        
        try:
            # Modern Zillow loads data via JS into script tags
            scripts = soup.select('script[type="application/json"]')
            property_data = None
            
            for script in scripts:
                if not script.string:
                    continue
                
                try:
                    data = json.loads(script.string)
                    
                    # Look for searchResults or searchPageState which usually contains the property data
                    if 'searchResults' in str(data):
                        # Navigate the JSON structure to find property listings
                        if 'cat1' in data and 'searchResults' in data['cat1']:
                            property_data = data['cat1']['searchResults']['listResults']
                        elif 'searchPageState' in data and 'searchResults' in data['searchPageState']:
                            property_data = data['searchPageState']['searchResults']['listResults']
                        
                        if property_data:
                            break
                except json.JSONDecodeError:
                    continue
            
            # Parse properties from JSON data
            if property_data:
                for item in property_data:
                    try:
                        address = item.get('address', '')
                        zpid = item.get('zpid', '')
                        price = item.get('price', 0)
                        
                        if isinstance(price, str):
                            # Remove $ and commas
                            price = int(re.sub(r'[^\d]', '', price))
                        
                        beds = item.get('beds', 0)
                        baths = item.get('baths', 0)
                        sqft = item.get('area', 0)
                        if isinstance(sqft, str):
                            sqft = int(re.sub(r'[^\d]', '', sqft))
                        
                        img_url = item.get('imgSrc', '')
                        detail_url = f"https://www.zillow.com/homedetails/{zpid}_zpid/"
                        
                        property_data = {
                            'title': address,
                            'address': address,
                            'price': price,
                            'bedrooms': beds,
                            'bathrooms': baths,
                            'size': sqft,
                            'property_type': 'House',
                            'image_url': img_url,
                            'description': f"{beds} bed, {baths} bath, {sqft} sqft home",
                            'for_sale': for_sale,
                            'detail_url': detail_url
                        }
                        
                        # If we have a detail URL, get more info
                        if detail_url:
                            detail_data = self.scrape_property_detail(detail_url)
                            if detail_data:
                                property_data.update(detail_data)
                        
                        properties.append(property_data)
                        self.log_progress(f"Scraped property", property_data['title'])
                    except Exception as e:
                        self.log_progress(f"Error processing property: {str(e)}")
        
            # Return the collected properties
            return properties
    
        except Exception as e:
            self.log_progress(f"Error scraping Zillow: {str(e)}")
            return []
    
    def scrape_property_detail(self, url):
        """Scrape detailed property info from its page"""
        soup = self.fetch_page(url)
        if not soup:
            return None
        
        try:
            # Try to get a better description
            description = ""
            desc_elem = soup.select_one("div[data-testid='home-description-text']")
            if desc_elem:
                description = self.clean_text(desc_elem.text)
            
            # Get more images if available
            images = []
            img_elems = soup.select("picture img")
            for img in img_elems:
                if img.has_attr('src') and img['src'] not in images:
                    images.append(img['src'])
            
            return {
                'description': description or None,
                'additional_images': images[:5]  # Limit to 5 additional images
            }
        except Exception as e:
            self.log_progress(f"Error scraping property detail: {str(e)}")
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
    
    def save_to_database(self, property_data, for_sale=True):
        """Save scraped property data to database"""
        # Use the base class method instead of direct get_or_create
        city = self.get_city(self.city_name)
        
        # Rest remains the same
        for data in property_data:
            try:
                # Get or create property type
                property_type, _ = PropertyType.objects.get_or_create(name=data['property_type'])
                
                # Get coordinates
                latitude, longitude = self.get_coordinates(data['address'])
                
                # Check if property already exists
                prop, created = Property.objects.get_or_create(
                    title=data['title'], 
                    address=data['address'],
                    defaults={
                        'description': data['description'],
                        'property_type': property_type,
                        'price': data['price'],
                        'bedrooms': data['bedrooms'],
                        'bathrooms': data['bathrooms'],
                        'size': data['size'],
                        'for_sale': for_sale,
                        'latitude': latitude,
                        'longitude': longitude,
                        'city': city
                    }
                )
                
                # Update existing property if it already exists
                if not created:
                    prop.description = data['description']
                    prop.property_type = property_type
                    prop.price = data['price']
                    prop.bedrooms = data['bedrooms']
                    prop.bathrooms = data['bathrooms']
                    prop.size = data['size']
                    prop.for_sale = for_sale
                    prop.latitude = latitude
                    prop.longitude = longitude
                    prop.city = city
                    prop.save()
                
                # Save property images
                if data.get('image_url'):
                    image_content = self.fetch_image(data['image_url'])
                    if image_content:
                        prop.image.save(f"{prop.id}.jpg", ContentFile(image_content), save=True)
                
                if data.get('additional_images'):
                    for idx, img_url in enumerate(data['additional_images']):
                        image_content = self.fetch_image(img_url)
                        if image_content:
                            prop.additional_images.create(image=ContentFile(image_content, name=f"{prop.id}_{idx}.jpg"))
                
                self.log_progress(f"Saved property to database", prop.title)
            except Exception as e:
                self.log_progress(f"Error saving property to database: {str(e)}")
    
    def fetch_image(self, url):
        """Download image from URL"""
        if not url:
            return None
            
        try:
            response = self.session.get(url, stream=True, timeout=30)
            if response.status_code == 200:
                return response.content
        except Exception as e:
            self.log_progress(f"Error downloading image: {str(e)}")
        
        return None

    def run(self, for_sale=True):
        """Run the property scraper"""
        property_type = "for sale" if for_sale else "for rent"
        self.log_progress(f"Starting property scraper for properties {property_type}")
        
        all_property_data = []
        
        # Scrape from Zillow
        zillow_data = self.scrape_zillow(self.sources[0], for_sale=for_sale)
        all_property_data.extend(zillow_data)
        self.log_progress(f"Scraped {len(zillow_data)} properties from Zillow")
        
        # Add more sources as needed:
        # realtor_data = self.scrape_realtor(self.sources[1], for_sale=for_sale)
        # all_property_data.extend(realtor_data)
        # self.log_progress(f"Scraped {len(realtor_data)} properties from Realtor.com")
        
        # Save to database
        self.save_to_database(all_property_data, for_sale)
        
        self.log_progress(f"Completed property scraper, processed {len(all_property_data)} properties {property_type}")
        
        return len(all_property_data)