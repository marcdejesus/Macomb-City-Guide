from core.models import City, Attraction, Restaurant, Event, Property, TransportOption

def clean_duplicate_cities():
    """Clean up duplicate city records and migrate related data to a single city"""
    
    # Find all cities named Macomb
    macomb_cities = City.objects.filter(name="Macomb").order_by('id')
    
    if macomb_cities.count() <= 1:
        print("No duplicate cities found.")
        return
    
    # Keep the first one and merge all others into it
    primary_city = macomb_cities.first()
    duplicate_cities = macomb_cities.exclude(id=primary_city.id)
    
    print(f"Found {duplicate_cities.count()} duplicate cities.")
    print(f"Primary city: ID={primary_city.id}, {primary_city.name}, {primary_city.state}")
    
    # Migrate all related records to the primary city
    for city in duplicate_cities:
        print(f"Processing duplicate city ID={city.id}")
        
        # Migrate attractions
        count = Attraction.objects.filter(city=city).update(city=primary_city)
        print(f"  - Migrated {count} attractions")
        
        # Migrate restaurants
        count = Restaurant.objects.filter(city=city).update(city=primary_city)
        print(f"  - Migrated {count} restaurants")
        
        # Migrate events
        count = Event.objects.filter(city=city).update(city=primary_city)
        print(f"  - Migrated {count} events")
        
        # Migrate properties
        count = Property.objects.filter(city=city).update(city=primary_city)
        print(f"  - Migrated {count} properties")
        
        # Migrate transport options
        count = TransportOption.objects.filter(city=city).update(city=primary_city)
        print(f"  - Migrated {count} transport options")
        
        # Delete the duplicate city
        print(f"  - Deleting duplicate city {city.id}")
        city.delete()
    
    print("Cleanup completed successfully!")

if __name__ == "__main__":
    clean_duplicate_cities()