import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  Share2, 
  ArrowLeft, 
  ChevronRight
} from "lucide-react";

// Components
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/Card";
import ShareMenu from "@/components/ShareMenu";
import RSVPButton from "./RSVPButton";

// This would be replaced with a real API call
async function getEvent(id) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sample event data - in production this would come from your API
  const events = [
    {
      id: "1",
      type: "event",
      title: "Macomb Summer Music Festival",
      description: "Annual outdoor music festival featuring local and national acts across three stages with food vendors and family activities.",
      longDescription: "The Macomb Summer Music Festival is the highlight of the season, bringing together music lovers from across the state. This year's lineup features an exciting mix of local talent and nationally recognized performers across three uniquely themed stages. \n\nThe main stage will showcase headlining acts, while the community stage highlights emerging local talent. Our acoustic stage offers an intimate setting for singer-songwriters and smaller ensembles.\n\nBeyond the music, festival-goers can enjoy a variety of food vendors representing cuisines from around the world, a craft beer garden featuring local breweries, and family-friendly activities including face painting, craft stations, and interactive music workshops for children.\n\nThe festival takes place in the beautiful Freedom Hill County Park, with ample space to spread out a blanket or set up lawn chairs. Don't miss this opportunity to create lasting summer memories while supporting live music in our community!",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
      images: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
        "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=800",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800",
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800"
      ],
      category: "Festival",
      venue: "Freedom Hill County Park",
      address: "14900 Metropolitan Pkwy, Sterling Heights, MI",
      date: "2025-07-15",
      time: "4:00 PM - 11:00 PM",
      price: 25,
      rating: 4.8,
      featured: true,
      organizer: "Macomb Cultural Alliance",
      contactEmail: "info@macombmusicfest.org",
      contactPhone: "(586) 286-9300",
      website: "https://www.macombmusicfest.org",
      attendees: 126,
      capacity: 5000,
      lineup: [
        "The Michigan Beats (8:30 PM - 10:30 PM)",
        "The Lakeside Band (6:30 PM - 8:00 PM)",
        "Dawn Acoustics (5:00 PM - 6:00 PM)",
        "Youth Showcase (4:00 PM - 4:45 PM)"
      ]
    },
    {
      id: "2",
      type: "event",
      title: "Macomb Food & Wine Festival",
      description: "Culinary showcase featuring local restaurants, wineries, and breweries with cooking demonstrations and tastings.",
      longDescription: "Join us for the annual Macomb Food & Wine Festival, a premier culinary event that celebrates the diverse food and beverage culture of our region. This year's festival brings together over 30 local restaurants, 15 Michigan wineries, and 10 craft breweries for a day of indulgence and discovery.\n\nAttendees will enjoy unlimited tastings from participating vendors, cooking demonstrations from renowned chefs, wine education seminars, and the opportunity to purchase their favorite discoveries directly from producers.\n\nHighlights include the Chef's Challenge competition, where local culinary talents compete live for the title of Festival Champion; the VIP lounge featuring exclusive premium wines and specialty cocktails; and the artisanal marketplace showcasing local food producers and culinary artisans.\n\nTickets include a commemorative wine glass, all food and beverage tastings, and access to demonstrations and seminars. VIP tickets additionally include early entry, access to the VIP lounge, and a swag bag of culinary goodies.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
      images: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
        "https://images.unsplash.com/photo-1575367439058-6096bb9cf5e2?q=80&w=800",
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800",
        "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?q=80&w=800"
      ],
      category: "Food",
      venue: "Lorenzo Cultural Center",
      address: "44575 Garfield Rd, Clinton Township, MI",
      date: "2025-05-22",
      time: "6:00 PM - 9:00 PM",
      price: 45,
      rating: 4.6,
      featured: false,
      organizer: "Macomb Culinary Council",
      contactEmail: "events@macombfoodwine.org",
      contactPhone: "(586) 445-7348",
      website: "https://www.macombfoodwinefest.org",
      attendees: 89,
      capacity: 600,
      highlights: [
        "30+ Local Restaurants",
        "15 Michigan Wineries",
        "10 Craft Breweries",
        "Live Cooking Demonstrations",
        "Chef's Challenge Competition"
      ]
    },
    {
      id: "3",
      type: "event",
      title: "Spring Arts & Crafts Fair",
      description: "Seasonal market featuring local artisans, handmade goods, and unique crafts from across the region.",
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800",
      category: "Market",
      venue: "Macomb Community College",
      address: "14500 E 12 Mile Rd, Warren, MI",
      date: "2025-04-18",
      time: "10:00 AM - 5:00 PM",
      price: 5,
      rating: 4.4,
    }
  ];
  
  const event = events.find(event => event.id === id);
  
  if (!event) {
    return null;
  }
  
  return event;
}

// Get related events (similar category or date)
async function getRelatedEvents(eventId, category) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Sample events data - in production this would come from your API
  const events = [
    {
      id: "4",
      type: "event",
      title: "Macomb County Fair",
      description: "Annual county fair featuring agricultural exhibits, carnival rides, entertainment, and traditional fair food.",
      image: "https://images.unsplash.com/photo-1567416661576-659fa88c9c97?q=80&w=800",
      category: "Festival",
      venue: "Macomb County Fairgrounds",
      address: "24580 Armada Ridge Rd, Armada, MI",
      date: "2025-07-30",
      time: "11:00 AM - 10:00 PM",
      price: 12,
      rating: 4.5,
    },
    {
      id: "9",
      type: "event",
      title: "Summer Movie in the Park",
      description: "Free outdoor screening of family films with pre-movie activities and concessions.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800",
      category: "Entertainment",
      venue: "Macomb Corners Park",
      address: "19449 25 Mile Rd, Macomb, MI",
      date: "2025-08-05",
      time: "8:30 PM - 10:30 PM",
      price: 0,
      rating: 4.5,
    },
    {
      id: "2",
      type: "event",
      title: "Macomb Food & Wine Festival",
      description: "Culinary showcase featuring local restaurants, wineries, and breweries with cooking demonstrations and tastings.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
      category: "Food",
      venue: "Lorenzo Cultural Center",
      address: "44575 Garfield Rd, Clinton Township, MI",
      date: "2025-05-22",
      time: "6:00 PM - 9:00 PM",
      price: 45,
      rating: 4.6,
    }
  ];
  
  // Filter out the current event and show events with same category or closest dates
  return events.filter(event => event.id !== eventId).slice(0, 3);
}

export default async function EventPage({ params }) {
  const event = await getEvent(params.id);
  
  // Handle event not found
  if (!event) {
    notFound();
  }
  
  // Fetch related events
  const relatedEvents = await getRelatedEvents(params.id, event.category);
  
  // Format the date for display
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/events" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all events
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{event.category}</Badge>
              <Badge variant="outline">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Badge>
              {event.price === 0 ? (
                <Badge variant="secondary">Free</Badge>
              ) : (
                <Badge variant="secondary">${event.price}</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-col sm:flex-row gap-y-2 gap-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {event.venue}
              </div>
            </div>
          </div>
          
          {/* Event Images */}
          <div className="mb-8">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-2">
              <Image
                src={event.images?.[0] || event.image}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {event.images && event.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {event.images.slice(1, 4).map((img, idx) => (
                  <div key={idx} className="aspect-[16/9] relative rounded-md overflow-hidden">
                    <Image
                      src={img}
                      alt={`${event.title} image ${idx + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <div className="text-muted-foreground whitespace-pre-line">
              {event.longDescription || event.description}
            </div>
          </div>
          
          {/* Event Details */}
          {event.lineup && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
              <ul className="space-y-2">
                {event.lineup.map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {event.highlights && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Event Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-muted-foreground">{event.address}</p>
                </div>
              </div>
              
              <div className="mt-4 aspect-[16/9] bg-accent/50 rounded-md flex items-center justify-center">
                {/* This would be replaced with an actual map component */}
                <div className="text-center p-6">
                  <p className="text-sm text-muted-foreground">Map view would display here</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Action Card */}
          <div className="bg-card border rounded-lg shadow-sm p-6 mb-6">
            {/* Price */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </p>
            </div>
            
            {/* Date & Time */}
            <div className="flex items-start mb-6">
              <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium">{formattedDate}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-start mb-6">
              <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium">{event.venue}</p>
                <p className="text-sm text-muted-foreground">{event.address}</p>
              </div>
            </div>
            
            {/* Attendees */}
            <div className="flex items-start mb-6">
              <Users className="h-5 w-5 mr-3 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium">{event.attendees || 0} attending</p>
                {event.capacity && (
                  <p className="text-sm text-muted-foreground">
                    {event.capacity - (event.attendees || 0)} spots remaining
                  </p>
                )}
              </div>
            </div>
            
            {/* RSVP Button */}
            <div className="mb-6">
              <RSVPButton eventId={event.id} />
            </div>
            
            {/* Share Button */}
            <ShareMenu url={`/events/${event.id}`} title={event.title} />
          </div>
          
          {/* Organizer Info */}
          {event.organizer && (
            <div className="bg-card border rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Organizer</h3>
              <p className="font-medium mb-2">{event.organizer}</p>
              
              {event.contactEmail && (
                <div className="text-sm mb-1">
                  <span className="text-muted-foreground">Email: </span>
                  <a href={`mailto:${event.contactEmail}`} className="text-primary hover:underline">
                    {event.contactEmail}
                  </a>
                </div>
              )}
              
              {event.contactPhone && (
                <div className="text-sm mb-1">
                  <span className="text-muted-foreground">Phone: </span>
                  <a href={`tel:${event.contactPhone}`} className="text-primary hover:underline">
                    {event.contactPhone}
                  </a>
                </div>
              )}
              
              {event.website && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Website: </span>
                  <a 
                    href={event.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Ticket/Registration Info */}
          <div className="bg-card border rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Ticket className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Ticket Information</h3>
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">General Admission</span>
                <span className="font-medium">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
              </li>
              
              {event.price > 0 && (
                <>
                  <Separator />
                  <li>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tickets available online or at the venue. Children under 12 enter free with a paying adult.
                    </p>
                    <Button className="w-full" size="sm" asChild>
                      <a 
                        href={event.website || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Purchase Tickets
                      </a>
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Related Events */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">You Might Also Like</h2>
          <Link href="/events" className="text-primary flex items-center hover:underline">
            View all events
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            {relatedEvents.map((event) => (
              <Card key={event.id} {...event} />
            ))}
          </Suspense>
        </div>
      </section>
    </div>
  );
}