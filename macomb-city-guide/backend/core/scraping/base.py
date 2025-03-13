# core/scraping/base.py
import requests
import json
import time
import random
import logging
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from datetime import datetime
from fake_useragent import UserAgent
import socks
import socket
from core.models import City 

logger = logging.getLogger('scraper')

class BaseScraper:
    """Base class for all scrapers with common functionality"""
    
    def __init__(self, city_name="Macomb"):
        self.city_name = city_name
        
        # Use rotating user agents to avoid detection
        user_agent_generator = UserAgent()
        
        # Configure session with standard headers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': user_agent_generator.random,
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Referer': 'https://www.google.com/',
            'Connection': 'keep-alive',
        })
        
        # Rate limiting and request timing
        self.rate_limit = 5  # Minimum seconds between requests
        self.last_request = 0
        
        # Proxy settings (optional, use if you need to rotate IPs)
        self.use_proxy = False
        self.proxy_list = [
            # Add your proxies here if needed
            # {"host": "proxy.example.com", "port": 8080, "username": "user", "password": "pass"},
        ]
    
    def configure_proxy(self):
        """Configure a proxy for the current session"""
        if not self.use_proxy or not self.proxy_list:
            return False
            
        proxy = random.choice(self.proxy_list)
        
        if proxy.get('type') == 'socks5':
            # Configure SOCKS5 proxy at the socket level
            socks.set_default_proxy(
                socks.SOCKS5, 
                proxy['host'], 
                proxy['port'], 
                username=proxy.get('username'), 
                password=proxy.get('password')
            )
            socket.socket = socks.socksocket
        else:
            # HTTP/HTTPS proxy at the requests level
            self.session.proxies = {
                'http': f"http://{proxy.get('username')}:{proxy.get('password')}@{proxy['host']}:{proxy['port']}",
                'https': f"https://{proxy.get('username')}:{proxy.get('password')}@{proxy['host']}:{proxy['port']}"
            }
        
        logger.info(f"Using proxy: {proxy['host']}:{proxy['port']}")
        return True
    
    def fetch_page(self, url, retries=3, javascript_required=False):
        """Fetch a webpage and return BeautifulSoup object with rate limiting and retry logic"""
        # Rate limiting
        current_time = time.time()
        sleep_time = max(0, self.rate_limit - (current_time - self.last_request))
        if sleep_time > 0:
            time.sleep(sleep_time + random.random())  # Add some randomness
            
        self.last_request = time.time()
        
        # Configure proxy if needed
        if self.use_proxy:
            self.configure_proxy()
            
        # Fetch with retry logic
        for attempt in range(retries):
            try:
                logger.info(f"Fetching URL: {url}")
                
                if javascript_required:
                    # If JS is required, use a headless browser solution
                    html = self._fetch_with_javascript(url)
                    return BeautifulSoup(html, 'html.parser')
                else:
                    # Standard request
                    response = self.session.get(
                        url, 
                        timeout=30,
                        headers={
                            'User-Agent': UserAgent().random  # Rotate user agent per request
                        }
                    )
                    response.raise_for_status()
                    return BeautifulSoup(response.text, 'html.parser')
                    
            except Exception as e:
                logger.error(f"Error fetching {url} (attempt {attempt+1}/{retries}): {str(e)}")
                if attempt < retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    
                    # Rotate user agent for next attempt
                    self.session.headers.update({
                        'User-Agent': UserAgent().random
                    })
                    
                    # Switch proxy if possible
                    if self.use_proxy:
                        self.configure_proxy()
                else:
                    return None
    
    def _fetch_with_javascript(self, url):
        """Use a headless browser to fetch content from JavaScript-heavy sites"""
        try:
            # This requires additional setup with selenium or playwright
            # Here's an example using selenium:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.chrome.service import Service
            from webdriver_manager.chrome import ChromeDriverManager
            
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument(f"user-agent={UserAgent().random}")
            
            with webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options) as driver:
                driver.get(url)
                time.sleep(5)  # Wait for JS to load
                return driver.page_source
        except Exception as e:
            logger.error(f"Error fetching with JavaScript: {str(e)}")
            return ""
    
    def clean_text(self, text):
        """Clean scraped text"""
        if not text:
            return ""
        return ' '.join(text.strip().split())
    
    def download_image(self, image_url):
        """Download an image from URL and return the binary content"""
        if not image_url:
            return None
            
        try:
            response = self.session.get(image_url, stream=True, timeout=20)
            response.raise_for_status()
            return response.content
        except Exception as e:
            self.log_progress(f"Error downloading image {image_url}: {str(e)}")
            return None
            
    def normalize_url(self, url, base_url):
        """Ensure URL is absolute by combining with base_url if needed"""
        if not url:
            return ""
            
        if url.startswith('http'):
            return url
        elif url.startswith('//'):
            parsed_base = urlparse(base_url)
            return f"{parsed_base.scheme}:{url}"
        else:
            return base_url.rstrip('/') + '/' + url.lstrip('/')
    
    def extract_json_from_script(self, soup, pattern=None):
        """Extract JSON data from script tags"""
        scripts = soup.find_all('script')
        
        for script in scripts:
            if not script.string:
                continue
                
            script_text = script.string.strip()
            
            # If looking for a specific pattern
            if pattern and pattern in script_text:
                # Try to find JSON objects in the script
                try:
                    start_idx = script_text.find('{')
                    if start_idx >= 0:
                        # Find matching closing brace
                        open_count = 0
                        for i in range(start_idx, len(script_text)):
                            if script_text[i] == '{':
                                open_count += 1
                            elif script_text[i] == '}':
                                open_count -= 1
                                if open_count == 0:
                                    json_str = script_text[start_idx:i+1]
                                    return json.loads(json_str)
                except Exception:
                    pass
            else:
                # Try to parse the whole script as JSON
                try:
                    return json.loads(script_text)
                except json.JSONDecodeError:
                    pass
        
        return None
    
    def log_progress(self, message, entity=None):
        """Log scraper progress"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entity_str = f" - {entity}" if entity else ""
        logger.info(f"[{timestamp}] {self.__class__.__name__}{entity_str}: {message}")
    
    def get_city(self, city_name):
        """Get or create a city with proper handling of duplicates"""
        # First try to find existing cities
        cities = City.objects.filter(name=city_name)
        
        if cities.exists():
            # Return the first one if multiple exist
            return cities.first()
        else:
            # Create a new city if none exist
            return City.objects.create(
                name=city_name,
                description=f"{city_name} is a vibrant city with many attractions.",
                population=91663,  # Default for Macomb
                climate="Continental"
            )