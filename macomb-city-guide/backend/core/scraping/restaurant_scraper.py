from django.core.files.base import ContentFile
from .base import BaseScraper
from core.models import Restaurant, Cuisine, City, Category
import requests
import re
from urllib.parse import urlparse
import json
from decimal import Decimal

class RestaurantScraper(BaseScraper):
    """Scraper for restaurant data"""
    
    def __init__(self, city_name="Macomb"):
        super().__init__(city_name)
        self.sources = [
            "https://www.yelp.com/search?find_desc=restaurants&find_loc=Macomb%2C+MI",
            "https://www.tripadvisor.com/Restaurants-g42424-Macomb_Michigan.html",
            "https://www.opentable.com/r/macomb-michigan", 
        ]
        
    def scrape_yelp(self, url, max_pages=5):
        """Scrape restaurant data from Yelp"""
        restaurants = []
        current_page = 1
        
        while current_page <= max_pages:
            page_url = url
            if current_page > 1:
                page_url = f"{url}&start={(current_page - 1) * 10}"
            
            soup = self.fetch_page(page_url)
            if not soup:
                break
                
            try:
                # Find restaurant listings
                restaurant_elements = soup.select('li.border-color--default__09f24__NPAKY')
                
                if not restaurant_elements:
                    # Try alternative selectors as Yelp changes their HTML structure frequently
                    restaurant_elements = soup.select('div[data-testid="serp-ia-card"]')
                
                if not restaurant_elements:
                    # One more attempt with different selectors
                    restaurant_elements = soup.select('.businessName__09f24__EYSZE')
                    if restaurant_elements:
                        # If we found business names, get their parent containers
                        restaurant_elements = [elem.parent.parent.parent for elem in restaurant_elements]
                
                if not restaurant_elements:
                    self.log_progress(f"No restaurant elements found on page {current_page}")
                    break
                    
                for restaurant_elem in restaurant_elements:
                    try:
                        # Extract restaurant name
                        name_elem = restaurant_elem.select_one('a.businessName__09f24__EYSZE span, .css-1m051bw, h3 a span')
                        if not name_elem:
                            continue
                            
                        name = self.clean_text(name_elem.text)
                        
                        # Extract restaurant URL for details
                        link_elem = restaurant_elem.select_one('a.businessName__09f24__EYSZE, h3 a')
                        restaurant_url = None
                        if link_elem and 'href' in link_elem.attrs:
                            href = link_elem['href']
                            if href.startswith('/'):
                                restaurant_url = f"https://www.yelp.com{href}"
                            else:
                                restaurant_url = href
                        
                        # If we have the URL, we can get more detailed information
                        restaurant_data = {
                            'name': name,
                            'image_url': '',
                            'description': '',
                            'address': '',
                            'cuisine': 'American',  # Default
                            'opening_hours': '',
                            'website': '',
                        }
                        
                        # Try to extract basic info from the listing
                        
                        # Cuisine/categories
                        category_elem = restaurant_elem.select_one('.css-16lklrv, .css-dzq7l1, .category-str-list')
                        if category_elem:
                            cuisine = self.clean_text(category_elem.text).split(',')[0]
                            if cuisine:
                                restaurant_data['cuisine'] = cuisine
                        
                        # Address
                        address_elem = restaurant_elem.select_one('.css-1e4fdj9, .address-row')
                        if address_elem:
                            address = self.clean_text(address_elem.text)
                            # Make sure address includes Macomb or is in nearby area
                            if 'macomb' in address.lower() or any(area in address.lower() for area in ['clinton township', 'shelby township', 'sterling heights', 'utica', 'chesterfield']):
                                restaurant_data['address'] = address
                            else:
                                restaurant_data['address'] = f"{address}, Macomb, MI"
                        
                        # Rating
                        rating_elem = restaurant_elem.select_one('.css-1fdy0l5, .i-stars')
                        rating = 0
                        if rating_elem:
                            # Try to extract rating from aria-label attribute
                            if 'aria-label' in rating_elem.attrs:
                                rating_text = rating_elem['aria-label']
                                rating_match = re.search(r'(\d+(\.\d+)?)', rating_text)
                                if rating_match:
                                    rating = float(rating_match.group(1))
                        
                        restaurant_data['rating'] = rating
                        
                        # Image
                        img_elem = restaurant_elem.select_one('img.css-xlzvdl, .photo-box img')
                        if img_elem and 'src' in img_elem.attrs:
                            restaurant_data['image_url'] = img_elem['src']
                        
                        # If we have the URL, fetch detailed information
                        if restaurant_url:
                            # Not fetching details for every restaurant to avoid too many requests
                            # You could fetch details for a subset or implement a delay
                            if restaurants and len(restaurants) % 5 == 0:  # Every 5th restaurant
                                details = self.scrape_restaurant_detail(restaurant_url)
                                if details:
                                    restaurant_data.update(details)
                        
                        # Price level in $ symbols
                        price_elem = restaurant_elem.select_one('.css-1s7bx9e, .price-range')
                        if price_elem:
                            price_text = self.clean_text(price_elem.text)
                            restaurant_data['price'] = price_text
                        
                        restaurants.append(restaurant_data)
                        self.log_progress(f"Scraped restaurant: {name}")
                        
                    except Exception as e:
                        self.log_progress(f"Error processing restaurant listing: {str(e)}")
                
                # Check if there's a next page
                next_button = soup.select_one('a.next-link, .next_page, [aria-label="Next page"]')
                if not next_button:
                    break
                    
                current_page += 1
                
                # Respect rate limits
                self.log_progress(f"Moving to page {current_page}")
                time.sleep(random.uniform(3, 6))
                
            except Exception as e:
                self.log_progress(f"Error scraping Yelp page {current_page}: {str(e)}")
                break
        
        return restaurants

    def scrape_restaurant_detail(self, url):
        """Scrape detailed restaurant info from its page"""
        soup = self.fetch_page(url)
        if not soup:
            return None
            
        details = {}
        
        try:
            # Description - Yelp doesn't always have descriptions, so combine from "about" section
            about_section = soup.select_one('.css-1ewcb8b, .from-the-business-section')
            if about_section:
                about_text = []
                paragraphs = about_section.select('p')
                for p in paragraphs:
                    about_text.append(self.clean_text(p.text))
                
                if about_text:
                    details['description'] = ' '.join(about_text)
            
            # If no description found, create one from the name and categories
            if not details.get('description'):
                name_elem = soup.select_one('h1')
                category_elems = soup.select('.css-1fdy0l5, .category-str-list a')
                
                name = self.clean_text(name_elem.text) if name_elem else ""
                categories = [self.clean_text(c.text) for c in category_elems]
                
                if name and categories:
                    details['description'] = f"{name} is a {', '.join(categories[:2])} restaurant in Macomb County."
                elif name:
                    details['description'] = f"{name} is a popular dining establishment in Macomb County."
            
            # Address
            address_elem = soup.select_one('address')
            if address_elem:
                address = self.clean_text(address_elem.text.replace('\n', ', '))
                details['address'] = address
            
            # Hours
            hours_section = soup.select_one('.hours-section, .css-1p9ibgf')
            if hours_section:
                hours_rows = hours_section.select('tbody tr')
                hours_text = []
                for row in hours_rows:
                    day = row.select_one('.day-of-the-week, .css-1957s6z')
                    hours = row.select_one('.no-wrap, .css-1kite64')
                    if day and hours:
                        hours_text.append(f"{self.clean_text(day.text)}: {self.clean_text(hours.text)}")
                
                if hours_text:
                    details['opening_hours'] = ', '.join(hours_text)
            
            # Website
            website_elem = soup.select_one('a[href^="https://www.yelp.com/biz_redir"]')
            if website_elem and 'href' in website_elem.attrs:
                website_url = website_elem['href']
                # Yelp redirects, so try to extract the actual URL
                url_match = re.search(r'url=([^&]+)', website_url)
                if url_match:
                    import urllib.parse
                    details['website'] = urllib.parse.unquote(url_match.group(1))
            
        except Exception as e:
            self.log_progress(f"Error scraping restaurant details: {str(e)}")
        
        return details
    
    def save_to_database(self, restaurant_data):
        """Save scraped restaurant data to database"""
        # Use the base class method instead of direct get_or_create
        city = self.get_city(self.city_name)
        
        # Rest remains the same
        for data in restaurant_data:
            try:
                # Get or create cuisine
                cuisine, _ = Cuisine.objects.get_or_create(name=data['cuisine'])
                
                # Clean the price field - convert to price level
                price = data.get('price', '$$')
                price_level = len(price) if isinstance(price, str) else 2
                
                # Check if restaurant already exists
                restaurant, created = Restaurant.objects.get_or_create(
                    name=data['name'], 
                    address=data['address'],
                    defaults={
                        'description': data['description'],
                        'cuisine': cuisine,
                        'opening_hours': data.get('opening_hours', 'Call for hours'),
                        'website': data.get('website', ''),
                        'featured': data.get('featured', False),
                        'city': city
                    }
                )
                
                # Update existing restaurant if needed
                if not created:
                    restaurant.description = data['description']
                    restaurant.cuisine = cuisine
                    restaurant.opening_hours = data.get('opening_hours', 'Call for hours')
                    restaurant.website = data.get('website', '')
                    restaurant.featured = data.get('featured', False)
                    restaurant.save()
                
                # Download and save image if it's a new restaurant or doesn't have an image
                if (created or not restaurant.image) and data.get('image_url'):
                    self.download_and_save_image(restaurant, data['image_url'])
                
                self.log_progress(f"{'Created' if created else 'Updated'} restaurant", restaurant.name)
            except Exception as e:
                self.log_progress(f"Error saving restaurant {data.get('name', 'unknown')}: {str(e)}")
    
    def download_and_save_image(self, restaurant, image_url):
        """Download and save restaurant image"""
        try:
            image_content = self.download_image(image_url)
            if not image_content:
                return False
                
            file_name = f"restaurant_{restaurant.id}_{urlparse(image_url).path.split('/')[-1]}"
            restaurant.image.save(file_name, ContentFile(image_content), save=True)
            return True
        except Exception as e:
            self.log_progress(f"Error saving image for {restaurant.name}: {str(e)}")
            return False
            
    def run(self):
        """Run the restaurant scraper"""
        self.log_progress("Starting restaurant scraper")
        
        all_restaurant_data = []
        
        # Scrape from Yelp
        yelp_data = self.scrape_yelp(self.sources[0])
        all_restaurant_data.extend(yelp_data)
        
        # Add more sources if needed
        # tripadvisor_data = self.scrape_tripadvisor(self.sources[1])
        # all_restaurant_data.extend(tripadvisor_data)
        
        # Save to database
        self.save_to_database(all_restaurant_data)
        
        self.log_progress(f"Completed restaurant scraper, scraped {len(all_restaurant_data)} restaurants")