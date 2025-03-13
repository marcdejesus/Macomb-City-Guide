from core.models import City, Attraction, Restaurant, Event, Property, TransportOption

def clean_duplicate_cities():
    """Clean up duplicate city records and migrate related data to a single city"""
    
    # Find all cities named Macomb
    macomb_cities = City.objects.filter(name="Macomb").order_by('id')
    
    if macomb_cities.count() <= 1:
        print("No duplicate cities found.")
        return
    
    print(f"Found {macomb_cities.count()} cities with name 'Macomb'")
    
    # Keep the first one and delete all others
    primary_city = macomb_cities.first()
    print(f"Keeping primary city: ID={primary_city.id}")
    
    # Delete all other cities
    for city in macomb_cities.exclude(id=primary_city.id):
        print(f"Deleting city with ID={city.id}")
        city.delete()
    
    print("Cleanup completed!")

if __name__ == "__main__":
    clean_duplicate_cities()