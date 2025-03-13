from core.models import City, Category, Attraction, Cuisine, Restaurant, EventType, Event
from django.utils import timezone
import datetime
from django.db.models import Q

print("Starting test data creation...")

# Create City
city, created = City.objects.get_or_create(
    name="Macomb",
    defaults={
        "state": "Michigan",
        "description": "A vibrant community in Michigan with beautiful parks, excellent schools, and convenient shopping.",
        "population": 91663,
        "climate": "Continental"
    }
)
if created:
    print(f"Created city: {city.name}")
else:
    print(f"Using existing city: {city.name}")

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
    category, created = Category.objects.get_or_create(name=name)
    if created:
        print(f"Created category: {category.name}")
    else:
        print(f"Using existing category: {category.name}")
    created_categories[name] = category

# Create Attractions (with duplicate checking)
attractions = [
    {
        "name": "Macomb Recreation Center",
        "description": "Modern recreational facility with pools, fitness areas, and sports courts for the entire family.",
        "address": "20699 Macomb St, Macomb, MI",
        "category": created_categories["Recreation"],
        "website": "https://www.macombrecreation.org",
        "phone": "(586) 445-5480",
        "hours": "Mon-Fri: 6am-9pm, Sat-Sun: 8am-6pm",
        "rating": 4.7,
        "featured": True,
    },
    {
        "name": "Stony Creek Metropark",
        "description": "Sprawling 4,500-acre park featuring hiking trails, beaches, golf course and winter activities.",
        "address": "4300 Main Park Rd, Shelby Township, MI",
        "category": created_categories["Outdoors"],
        "website": "https://www.metroparks.com/stony-creek",
        "phone": "(586) 781-4242",
        "hours": "Daily: 6am-10pm",
        "rating": 4.8,
    },
    {
        "name": "Partridge Creek Mall",
        "description": "Open-air shopping center with premium stores, restaurants and pet-friendly spaces.",
        "address": "17420 Hall Rd, Clinton Township, MI",
        "category": created_categories["Shopping"],
        "website": "https://www.shoppartridgecreek.com",
        "phone": "(586) 226-0330",
        "hours": "Mon-Sat: 10am-9pm, Sun: 11am-6pm",
        "rating": 4.5,
    }
]

for attraction_data in attractions:
    # Check if attraction with this name already exists
    existing = Attraction.objects.filter(name=attraction_data['name']).first()
    if existing:
        print(f"Skipping existing attraction: {attraction_data['name']}")
        continue
    
    attraction = Attraction.objects.create(
        name=attraction_data['name'],
        description=attraction_data['description'],
        address=attraction_data['address'],
        category=attraction_data['category'],
        website=attraction_data.get('website', ''),
        phone=attraction_data.get('phone', ''),
        hours=attraction_data.get('hours', ''),
        rating=attraction_data.get('rating', 0),
        featured=attraction_data.get('featured', False),
        city=city
    )
    print(f"Created attraction: {attraction.name}")

# Create Cuisines
cuisines = ["American", "Italian", "Mexican", "Asian", "Mediterranean", "Fast Food", "Seafood"]
created_cuisines = {}

for cuisine_name in cuisines:
    cuisine, created = Cuisine.objects.get_or_create(name=cuisine_name)
    if created:
        print(f"Created cuisine: {cuisine.name}")
    else:
        print(f"Using existing cuisine: {cuisine.name}")
    created_cuisines[cuisine_name] = cuisine

# Create Restaurants
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

for restaurant_data in restaurants:
    # Check if restaurant already exists
    existing = Restaurant.objects.filter(name=restaurant_data['name']).first()
    if existing:
        print(f"Skipping existing restaurant: {restaurant_data['name']}")
        continue
    
    restaurant = Restaurant.objects.create(**restaurant_data)
    print(f"Created restaurant: {restaurant.name}")

# Create Event Types
event_types = ["Festival", "Concert", "Sports", "Community", "Exhibition"]
created_event_types = {}

for event_type_name in event_types:
    event_type, created = EventType.objects.get_or_create(name=event_type_name)
    if created:
        print(f"Created event type: {event_type.name}")
    else:
        print(f"Using existing event type: {event_type.name}")
    created_event_types[event_type_name] = event_type

# Create Events
# Use realistic dates starting from tomorrow
tomorrow = timezone.now().date() + datetime.timedelta(days=1)
events = [
    {
        "name": "Macomb Summer Festival",
        "description": "Annual celebration with live music, food vendors, carnival rides, and community activities.",
        "city": city,
        "address": "Macomb Town Square, Main St, Macomb, MI",
        "event_type": created_event_types["Festival"],
        "date": tomorrow + datetime.timedelta(days=10),
        "time": "12:00 PM - 10:00 PM",
        "featured": True,
        "website": "https://www.macombfestival.com"
    },
    {
        "name": "Outdoor Concert Series",
        "description": "Weekly summer concerts featuring local and regional bands in the park.",
        "city": city,
        "address": "Veterans Memorial Park, 25500 Jefferson Ave, Macomb, MI",
        "event_type": created_event_types["Concert"],
        "date": tomorrow + datetime.timedelta(days=3),
        "time": "7:00 PM - 9:00 PM",
        "featured": False,
        "website": "https://www.macombparks.org/concerts"
    },
    {
        "name": "Farmers Market",
        "description": "Weekly market featuring fresh produce, handmade crafts, and local food vendors.",
        "city": city,
        "address": "Downtown Macomb, 1 Main St, Macomb, MI",
        "event_type": created_event_types["Community"],
        "date": tomorrow + datetime.timedelta(days=7),
        "time": "9:00 AM - 2:00 PM",
        "featured": True,
        "website": "https://www.macombfarmersmarket.org"
    }
]

for event_data in events:
    # Check if event with same name and date already exists
    existing = Event.objects.filter(
        Q(name=event_data['name']) & 
        Q(date=event_data['date'])
    ).first()
    
    if existing:
        print(f"Skipping existing event: {event_data['name']} on {event_data['date']}")
        continue
    
    event = Event.objects.create(**event_data)
    print(f"Created event: {event.name} on {event.date}")

print("Test data creation complete!")