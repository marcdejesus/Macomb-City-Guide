# core/management/commands/run_scrapers.py
from django.core.management.base import BaseCommand
from core.scraping import (
    AttractionScraper, 
    RestaurantScraper, 
    EventScraper, 
    PropertyScraper,
    TransportScraper
)

class Command(BaseCommand):
    help = 'Run data scrapers'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--type', 
            type=str, 
            help='Type of scraper to run (attractions, restaurants, events, properties, transportation, all)'
        )
        
    def handle(self, *args, **options):
        scraper_type = options.get('type', 'all')
        
        if scraper_type in ['attractions', 'all']:
            self.stdout.write('Running attraction scraper...')
            attraction_scraper = AttractionScraper()
            count = attraction_scraper.run()
            self.stdout.write(self.style.SUCCESS(f'Successfully scraped {count} attractions'))
        
        if scraper_type in ['restaurants', 'all']:
            self.stdout.write('Running restaurant scraper...')
            restaurant_scraper = RestaurantScraper()
            count = restaurant_scraper.run()
            self.stdout.write(self.style.SUCCESS(f'Successfully scraped {count} restaurants'))
        
        if scraper_type in ['events', 'all']:
            self.stdout.write('Running event scraper...')
            event_scraper = EventScraper()
            count = event_scraper.run()
            self.stdout.write(self.style.SUCCESS(f'Successfully scraped {count} events'))
        
        if scraper_type in ['properties', 'all']:
            self.stdout.write('Running property scraper...')
            property_scraper = PropertyScraper()
            for_sale_count = property_scraper.run(for_sale=True)
            for_rent_count = property_scraper.run(for_sale=False)
            self.stdout.write(self.style.SUCCESS(
                f'Successfully scraped {for_sale_count} properties for sale and {for_rent_count} for rent'
            ))
        
        if scraper_type in ['transportation', 'all']:
            self.stdout.write('Running transportation scraper...')
            transport_scraper = TransportScraper()
            count = transport_scraper.run()
            self.stdout.write(self.style.SUCCESS(f'Successfully scraped {count} transportation options'))