import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  ListFilter, 
  Rows, 
  Grid, 
  MapPin, 
  Clock,
  ChevronDown
} from "lucide-react";

import { Card } from "@/components/Card";
import { Searchbar } from "@/components/Searchbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientPaginationSection from "@/components/ClientPaginationSection";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This would be replaced with a real API call in production
async function getEvents(searchParams) {
  // Simulate a delay as if fetching from an API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Extract search parameters with defaults
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const sort = searchParams?.sort || "date-asc";
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const featured = searchParams?.featured === "true";
  
  // These would come from an API
  const allEvents = [
    {
      id: 1,
      type: "event",
      title: "Macomb Summer Music Festival",
      description: "Annual outdoor music festival featuring local and national acts across three stages with food vendors and family activities.",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
      category: "Festival",
      venue: "Freedom Hill County Park",
      address: "14900 Metropolitan Pkwy, Sterling Heights, MI",
      date: "2025-07-15",
      time: "4:00 PM - 11:00 PM",
      price: 25,
      rating: 4.8,
      featured: true,
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
    {
      id: 4,
      type: "event",
      title: "Macomb County Fair",
      description: "Annual county fair featuring agricultural exhibits, carnival rides, entertainment, and traditional fair food.",
      image: "https://images.unsplash.com/photo-1567416661576-659fa88c9c97?q=80&w=800",
      category: "Fair",
      venue: "Macomb County Fairgrounds",
      address: "24580 Armada Ridge Rd, Armada, MI",
      date: "2025-07-30",
      time: "11:00 AM - 10:00 PM",
      price: 12,
      rating: 4.5,
    },
    {
      id: 5,
      type: "event",
      title: "Classic Car Show",
      description: "Showcase of vintage and classic automobiles with awards, music, and automotive memorabilia.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800",
      category: "Automotive",
      venue: "Downtown Mount Clemens",
      address: "Downtown Mount Clemens, MI",
      date: "2025-06-12",
      time: "10:00 AM - 4:00 PM",
      price: 0,
      rating: 4.7,
    },
    {
      id: 6,
      type: "event",
      title: "Macomb Symphony Orchestra: Summer Concert",
      description: "Evening of classical music performed by the Macomb Symphony Orchestra featuring guest soloists.",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800",
      category: "Concert",
      venue: "Macomb Center for the Performing Arts",
      address: "44575 Garfield Rd, Clinton Township, MI",
      date: "2025-06-28",
      time: "7:30 PM - 9:30 PM",
      price: 35,
      rating: 4.8,
    },
    {
      id: 7,
      type: "event",
      title: "Community Volunteer Day",
      description: "Township-wide volunteer event with projects including park cleanups, community garden planting, and senior assistance.",
      image: "https://images.unsplash.com/photo-1560252829-804f1aeaf1be?q=80&w=800",
      category: "Community",
      venue: "Various Locations",
      address: "Macomb Township, MI",
      date: "2025-05-10",
      time: "9:00 AM - 2:00 PM",
      price: 0,
      rating: 4.6,
    },
    {
      id: 8,
      type: "event",
      title: "Farmers Market Opening Day",
      description: "Seasonal opening of the weekly farmers market with local produce, baked goods, and artisanal products.",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800",
      category: "Market",
      venue: "Macomb Township Recreation Center",
      address: "20699 Macomb St, Macomb, MI",
      date: "2025-05-03",
      time: "8:00 AM - 1:00 PM",
      price: 0,
      rating: 4.4,
    },
    {
      id: 9,
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
      id: 10,
      type: "event",
      title: "Run for the Parks 5K",
      description: "Annual charity run/walk benefiting local parks with medals, refreshments, and family activities.",
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800",
      category: "Sports",
      venue: "Stony Creek Metropark",
      address: "4300 Main Park Rd, Shelby Township, MI",
      date: "2025-06-07",
      time: "9:00 AM - 12:00 PM",
      price: 30,
      rating: 4.7,
    },
    {
      id: 11,
      type: "event",
      title: "Business Expo & Networking Event",
      description: "Local business showcase with exhibitors, workshops, and networking opportunities.",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800",
      category: "Business",
      venue: "Macomb Community College",
      address: "14500 E 12 Mile Rd, Warren, MI",
      date: "2025-09-17",
      time: "1:00 PM - 7:00 PM",
      price: 10,
      rating: 4.3,
    },
    {
      id: 12,
      type: "event",
      title: "Fall Harvest Festival",
      description: "Celebration of autumn with pumpkin carving, hayrides, cider, and seasonal treats.",
      image: "https://images.unsplash.com/photo-1508995476428-43d70c3d0042?q=80&w=800",
      category: "Festival",
      venue: "Wolcott Mill Metropark",
      address: "65775 Wolcott Rd, Ray Township, MI",
      date: "2025-10-09",
      time: "12:00 PM - 6:00 PM",
      price: 8,
      rating: 4.6,
    }
  ];
  
  // Filter by search term
  let filteredEvents = [...allEvents];
  if (search) {
    const searchLower = search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.venue.toLowerCase().includes(searchLower) ||
        event.address.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by category
  if (category) {
    filteredEvents = filteredEvents.filter((event) => event.category === category);
  }
  
  // Filter by date range
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate <= end;
    });
  } else if (startDate) {
    const start = new Date(startDate);
    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= start;
    });
  } else if (endDate) {
    const end = new Date(endDate);
    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate <= end;
    });
  }
  
  // Filter by featured
  if (featured) {
    filteredEvents = filteredEvents.filter((event) => event.featured);
  }
  
  // Sort events
  switch (sort) {
    case "date-asc":
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "date-desc":
      filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "price-asc":
      filteredEvents.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredEvents.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      filteredEvents.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      // Default to upcoming events
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  // Calculate pagination
  const totalEvents = filteredEvents.length;
  const totalPages = Math.ceil(totalEvents / limit);
  const offset = (page - 1) * limit;
  const paginatedEvents = filteredEvents.slice(offset, offset + limit);
  
  return {
    events: paginatedEvents,
    totalEvents,
    totalPages,
    currentPage: page,
    allEvents  // Add this to return the full events array
  };
}

// Define filter options for the searchbar
const eventFilters = [
  {
    name: "category",
    label: "Category",
    options: [
      { value: "", label: "All Categories" },
      { value: "Festival", label: "Festivals" },
      { value: "Concert", label: "Concerts" },
      { value: "Sports", label: "Sports" },
      { value: "Market", label: "Markets" },
      { value: "Community", label: "Community" },
      { value: "Food", label: "Food & Drink" },
      { value: "Entertainment", label: "Entertainment" },
      { value: "Business", label: "Business" },
      { value: "Automotive", label: "Automotive" }
    ]
  },
  {
    name: "sort",
    label: "Sort By",
    options: [
      { value: "date-asc", label: "Date: Upcoming First" },
      { value: "date-desc", label: "Date: Latest First" },
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
      { value: "name-asc", label: "Name: A-Z" },
      { value: "name-desc", label: "Name: Z-A" }
    ]
  },
  {
    name: "featured",
    label: "Featured",
    options: [
      { value: "", label: "All Events" },
      { value: "true", label: "Featured Events" }
    ]
  }
];

export default async function EventsPage({ searchParams }) {
  const { events, totalEvents, totalPages, currentPage, allEvents } = await getEvents(searchParams);
  
  // Build pagination params
  const paginationParams = {
    currentPage,
    totalPages,
    basePath: '/events',
    searchParams: {
      search: searchParams.search,
      category: searchParams.category,
      sort: searchParams.sort,
      featured: searchParams.featured,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate
    }
  };
  
  // Determine if we're showing grid (default) or list view
  const viewMode = searchParams.view || 'grid';
  
  return (
    <div className="container py-8 min-h-screen">
      {/* Page header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Events in Macomb</h1>
        <p className="text-muted-foreground">
          Find upcoming events, festivals, concerts and community gatherings in Macomb Township and surrounding areas.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6">
        <Searchbar 
          placeholder="Search events by name, venue or location..." 
          filters={eventFilters}
          type="event"
        />
      </div>
      
      {/* Date range picker */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Date Range:</span>
        </div>
        <DateRangePicker />
      </div>
      
      {/* Results count and view toggle */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{events.length}</span> of{" "}
          <span className="font-medium text-foreground">{totalEvents}</span> events
        </p>
        
        <div className="flex gap-2">
          <Link 
            href={{ pathname: "/events", query: { ...searchParams, view: 'grid' } }}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-accent' : 'hover:bg-muted'}`}
          >
            <Grid className="h-5 w-5" />
          </Link>
          <Link 
            href={{ pathname: "/events", query: { ...searchParams, view: 'list' } }}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-accent' : 'hover:bg-muted'}`}
          >
            <Rows className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Featured event (if available and on first page) */}
      {currentPage === 1 && events.some(event => event.featured) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Badge variant="default" className="mr-2">Featured</Badge>
            Featured Event
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 bg-muted/30 rounded-lg p-4">
            {events
              .filter(event => event.featured)
              .slice(0, 1)
              .map(event => (
                <div key={event.id} className="col-span-1">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
              
            {events
              .filter(event => event.featured)
              .slice(0, 1)
              .map(event => (
                <div key={`desc-${event.id}`} className="col-span-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md">
                      <span className="text-sm font-medium">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{event.venue} - {event.address}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{event.description}</p>
                  <div className="mt-auto">
                    <Link href={`/events/${event.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Event listings - Grid or List view */}
      <Suspense fallback={<LoadingSpinner />}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events
              .filter(event => !event.featured || currentPage !== 1)
              .map(event => (
                <Card 
                  key={event.id} 
                  {...event}
                />
              ))}
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {events
              .filter(event => !event.featured || currentPage !== 1)
              .map(event => (
                <Link href={`/events/${event.id}`} key={event.id}
                  className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-48 md:shrink-0">
                      <Image 
                        src={event.image} 
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="font-bold">{event.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{event.category}</Badge>
                          <Badge variant={event.price === 0 ? 'outline' : 'default'}>
                            {event.price === 0 ? 'Free' : `$${event.price}`}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap md:flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </Suspense>
      
      {/* Show message if no events found */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && <ClientPaginationSection {...paginationParams} />}
      
      {/* Upcoming events table by month */}
      <section className="mt-12 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Event Calendar</h2>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="this-month">This Month</TabsTrigger>
            <TabsTrigger value="next-month">Next Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <EventCalendarTable events={allEvents.slice(0, 5)} />
          </TabsContent>
          
          <TabsContent value="this-month">
            <EventCalendarTable events={allEvents.slice(2, 8)} />
          </TabsContent>
          
          <TabsContent value="next-month">
            <EventCalendarTable events={allEvents.slice(4, 10)} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

// Event Calendar Table Component
function EventCalendarTable({ events }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left p-3 text-sm font-medium">Date</th>
            <th className="text-left p-3 text-sm font-medium">Event</th>
            <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Venue</th>
            <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Category</th>
            <th className="text-left p-3 text-sm font-medium">Price</th>
            <th className="text-left p-3 text-sm font-medium w-24"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {events.map(event => (
            <tr key={event.id} className="hover:bg-muted/30">
              <td className="p-3">
                <div className="text-center border rounded-md w-14 overflow-hidden">
                  <div className="bg-primary text-primary-foreground text-xs py-1">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-lg py-1 font-medium">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
              </td>
              <td className="p-3">
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-muted-foreground">{event.time}</div>
              </td>
              <td className="p-3 hidden md:table-cell">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-sm">{event.venue}</span>
                </div>
              </td>
              <td className="p-3 hidden md:table-cell">
                <Badge variant="outline">{event.category}</Badge>
              </td>
              <td className="p-3">
                {event.price === 0 ? (
                  <Badge variant="secondary">Free</Badge>
                ) : (
                  <span className="font-medium">${event.price}</span>
                )}
              </td>
              <td className="p-3 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/events/${event.id}`}>Details</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}