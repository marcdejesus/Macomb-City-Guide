from django.core.management.base import BaseCommand
from core.scraping.attractions_scraper import AttractionScraper
from core.scraping.restaurant_scraper import RestaurantScraper
from core.scraping.event_scraper import EventScraper
from core.scraping.property_scraper import PropertyScraper
from django.utils import timezone

class Command(BaseCommand):
    help = 'Run scrapers on-demand via API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--type', 
            type=str, 
            default='all',
            help='Type of scraper to run (attractions, restaurants, events, properties, transportation, all)'
        )

    def handle(self, *args, **options):
        self.stdout.write(f"API-triggered scraping started at {timezone.now()}")
        
        scraper_type = options.get('type', 'all')
        
        if scraper_type == 'attractions' or scraper_type == 'all':
            self.stdout.write("Running attraction scraper...")
            attraction_scraper = AttractionScraper()
            count = attraction_scraper.run()
            self.stdout.write(self.style.SUCCESS(f"Scraped {count} attractions"))
        
        if scraper_type == 'restaurants' or scraper_type == 'all':
            self.stdout.write("Running restaurant scraper...")
            restaurant_scraper = RestaurantScraper()
            count = restaurant_scraper.run()
            self.stdout.write(self.style.SUCCESS(f"Scraped {count} restaurants"))
        
        if scraper_type == 'events' or scraper_type == 'all':
            self.stdout.write("Running event scraper...")
            event_scraper = EventScraper()
            count = event_scraper.run()
            self.stdout.write(self.style.SUCCESS(f"Scraped {count} events"))
        
        if scraper_type == 'properties' or scraper_type == 'all':
            self.stdout.write("Running property scraper...")
            property_scraper = PropertyScraper()
            count = property_scraper.run()
            self.stdout.write(self.style.SUCCESS(f"Scraped {count} properties"))
        
        self.stdout.write(self.style.SUCCESS(f"API-triggered scraping completed at {timezone.now()}"))