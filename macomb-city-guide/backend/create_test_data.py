from core.models import City, Category, Attraction, Cuisine, Restaurant, EventType, Event
from django.utils import timezone
import datetime

# Create City
city = City.objects.create(
    name="Macomb",
    state="Michigan",
    description="A vibrant community in Michigan with beautiful parks, excellent schools, and convenient shopping.",
    population=91663,
    climate="Continental"
)
print(f"Created city: {city.name}")

# Create Categories
categories = {
    "Outdoors": "Outdoor attractions and natural spaces",
    "Recreation": "Recreational facilities and activities",
    "Arts": "Arts and cultural venues",
    "Museum": "Museums and historical sites",
    "Shopping": "Retail and shopping destinations",
    "Sports": "Sports venues and activities",
    "Entertainment": "Entertainment venues and activities"
}

created_categories = {}
for name, description in categories.items():
    # First try to get the existing category
    category = Category.objects.filter(name=name).first()
    if not category:
        # Create it if it doesn't exist
        category = Category.objects.create(name=name)
        print(f"Created category: {category.name}")
    else:
        print(f"Using existing category: {category.name}")
    created_categories[name] = category

# Create Attractions
attractions = [
    {
        "name": "Macomb Recreation Center",
        "description": "Modern recreational facility with pools, fitness areas, and sports courts for the entire family.",
        "address": "20699 Macomb St, Macomb, MI",
        "category": created_categories["Recreation"],
        "city": city,
        "price": "$5-15",
        "featured": True,
        "rating": 4.7,
        "website": "https://www.macombrec.org",
        "opening_hours": "Mon-Fri: 6am-9pm, Sat-Sun: 8am-6pm"
    },
    {
        "name": "Stony Creek Metropark",
        "description": "Sprawling 4,500-acre park featuring hiking trails, beaches, golf course and winter activities.",
        "address": "4300 Main Park Rd, Shelby Township, MI",
        "category": created_categories["Outdoors"],
        "city": city,
        "price": "$10 entry",
        "featured": True,
        "rating": 4.8,
        "website": "https://www.metroparks.com/stony-creek",
        "opening_hours": "Daily: 8am-8pm"
    },
    {
        "name": "Partridge Creek Mall",
        "description": "Open-air shopping center with premium retailers, restaurants, and a dog-friendly environment.",
        "address": "17420 Hall Rd, Clinton Township, MI",
        "category": created_categories["Shopping"],
        "city": city,
        "price": "Free entry",
        "featured": True,
        "rating": 4.5,
        "website": "https://www.shoppartridgecreek.com",
        "opening_hours": "Mon-Sat: 10am-9pm, Sun: 12pm-6pm"
    }
]

for attr_data in attractions:
    attraction = Attraction.objects.create(**attr_data)
    print(f"Created attraction: {attraction.name}")

# Create Cuisines
cuisines = ["Italian", "American", "Asian", "Mexican", "Mediterranean"]
created_cuisines = {}
for name in cuisines:
    cuisine, created = Cuisine.objects.get_or_create(name=name)
    created_cuisines[name] = cuisine
    print(f"Created cuisine: {cuisine.name}")

# Update the restaurant objects in create_test_data.py
restaurants = [
    {
        "name": "Bonefish Grill",
        "description": "Upscale seafood restaurant with market-fresh fish and wood-grilled specialties.",
        "address": "17380 Hall Rd, Clinton Township, MI",
        "city": city,
        "cuisine": created_cuisines["American"],
        "price_level": 3,
        "featured": True,
        "phone": "(586) 412-0814",
        "website": "https://www.bonefishgrill.com",
        "rating": 4.6,
        "review_count": 128
    },
    {
        "name": "Antonio's Italian Cuisine",
        "description": "Family-owned restaurant serving authentic Italian dishes and wood-fired pizzas.",
        "address": "15750 Hall Rd, Macomb, MI",
        "city": city,
        "cuisine": created_cuisines["Italian"],
        "price_level": 2,
        "featured": True,
        "phone": "(586) 416-3388",
        "website": "https://www.antoniositalian.com",
        "rating": 4.4,
        "review_count": 96
    }
]

for rest_data in restaurants:
    restaurant = Restaurant.objects.create(**rest_data)
    print(f"Created restaurant: {restaurant.name}")

# Create Event Types
event_types = ["Festival", "Concert", "Community", "Sports", "Market"]
created_event_types = {}
for name in event_types:
    event_type, created = EventType.objects.get_or_create(name=name)
    created_event_types[name] = event_type
    print(f"Created event type: {event_type.name}")

# Create Events
today = datetime.date.today()
events = [
    {
        "name": "Macomb Food Festival",
        "description": "Annual celebration of local cuisine featuring restaurants, food trucks, and live entertainment.",
        "date": today + datetime.timedelta(days=7),
        "time": "12:00 PM - 9:00 PM",
        "venue": "Downtown Macomb",
        "address": "Main Street, Macomb, MI",
        "city": city,
        "event_type": created_event_types["Festival"],
        "featured": True,
        "website": "https://www.macombfoodfest.com"
    },
    {
        "name": "Farmers Market at the Mall",
        "description": "Weekly market featuring local produce, artisanal foods, and handcrafted goods.",
        "date": today + datetime.timedelta(days=14),
        "time": "9:00 AM - 2:00 PM",
        "venue": "The Mall at Partridge Creek",
        "address": "17420 Hall Rd, Clinton Township, MI",
        "city": city,
        "event_type": created_event_types["Market"],
        "featured": True,
        "website": "https://www.shoppartridgecreek.com/farmersmarket"
    }
]

for event_data in events:
    event = Event.objects.create(**event_data)
    print(f"Created event: {event.name}")

print("Test data creation completed successfully!")