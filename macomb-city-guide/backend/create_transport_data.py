from core.models import City, TransportType, TransportOption
from django.utils import timezone
import datetime

print("Starting transport data creation...")

# Get the city
city = City.objects.get(name="Macomb")
print(f"Using city: {city.name}")

# Create Transport Types
transport_types = {
    "Bus": "Public bus services and transit routes",
    "Taxi": "Taxi services and cab companies",
    "Rideshare": "App-based ridesharing services",
    "Parking": "Public parking facilities and garages"
}

created_transport_types = {}
for name, description in transport_types.items():
    transport_type, created = TransportType.objects.get_or_create(name=name)
    if created:
        print(f"Created transport type: {transport_type.name}")
    else:
        print(f"Using existing transport type: {transport_type.name}")
    created_transport_types[name] = transport_type

# Create Transport Options
transport_options = [
    {
        "name": "SMART Bus - Macomb County Routes",
        "description": "Suburban Mobility Authority for Regional Transportation operates bus services throughout Macomb County.",
        "city": city,
        "transport_type": created_transport_types["Bus"],
        "address": "Macomb County Service Area",
        "routes": "Routes 510, 530, 560, 580",
        "schedule": "Monday-Friday: 5am-12am, Weekends: 7am-10pm",
        "website": "https://www.smartbus.org",
        "featured": True,
    },
    {
        "name": "Macomb County Transit Connection",
        "description": "Local transit service focusing on accessibility for seniors and people with disabilities.",
        "city": city,
        "transport_type": created_transport_types["Bus"],
        "address": "Macomb County Administration Building, Mount Clemens",
        "routes": "Community Routes",
        "schedule": "Monday-Friday: 6am-6pm",
        "website": "https://www.macombcountymi.gov/transit",
    },
    {
        "name": "Macomb Taxi Service",
        "description": "Local taxi company serving all of Macomb County with 24/7 availability.",
        "city": city,
        "transport_type": created_transport_types["Taxi"],
        "address": "Serving all of Macomb County, MI",
        "routes": "",
        "schedule": "Available 24/7",
        "website": "https://www.macombtaxi.com",
    },
    {
        "name": "Uber",
        "description": "Rideshare service available throughout Macomb County via mobile app.",
        "city": city,
        "transport_type": created_transport_types["Rideshare"],
        "address": "Serving all of Macomb County, MI",
        "routes": "",
        "schedule": "24/7 service via mobile app. Availability depends on drivers.",
        "website": "https://www.uber.com",
        "featured": True,
    },
    {
        "name": "Lyft",
        "description": "Rideshare platform offering on-demand transportation services.",
        "city": city,
        "transport_type": created_transport_types["Rideshare"],
        "address": "Serving all of Macomb County, MI",
        "routes": "",
        "schedule": "24/7 service via mobile app. Availability depends on drivers.",
        "website": "https://www.lyft.com",
    },
    {
        "name": "Downtown Mount Clemens Parking Garage",
        "description": "Multi-level covered parking garage in the heart of downtown Mount Clemens.",
        "city": city,
        "transport_type": created_transport_types["Parking"],
        "address": "100 N. Main Street, Mount Clemens, MI",
        "routes": "",
        "schedule": "Open 24/7",
        "website": "",
        "featured": True,
    },
    {
        "name": "Macomb County Administration Parking",
        "description": "Public parking lot adjacent to the Macomb County Administration Building.",
        "city": city,
        "transport_type": created_transport_types["Parking"],
        "address": "10 N. Main Street, Mount Clemens, MI",
        "routes": "",
        "schedule": "Monday-Friday: 7am-7pm",
        "website": "",
    },
    {
        "name": "Lakeside Mall Parking",
        "description": "Extensive parking surrounding the Lakeside Mall shopping center.",
        "city": city,
        "transport_type": created_transport_types["Parking"],
        "address": "14000 Lakeside Circle, Sterling Heights, MI",
        "routes": "",
        "schedule": "Mall Hours: 10am-9pm",
        "website": "https://www.shopvisitlakesidemall.com",
    }
]

for option_data in transport_options:
    # Check if transport option already exists
    existing = TransportOption.objects.filter(name=option_data['name']).first()
    if existing:
        print(f"Skipping existing transport option: {option_data['name']}")
        continue
    
    transport = TransportOption.objects.create(**option_data)
    print(f"Created transport option: {transport.name}")

print("Transport data creation complete!")