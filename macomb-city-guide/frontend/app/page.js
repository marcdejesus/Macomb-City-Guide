import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Card, SimpleCard } from "@/components/Card";
import { Hero } from "@/components/Hero";
import { Searchbar } from "@/components/Searchbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Calendar, Landmark, Utensils, Building, Bus, ChevronRight } from "lucide-react";
import ClientCarouselSection from "@/components/ClientCarouselSection";

// Import HoverCard (these should already be client components)
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// This would typically come from your API
const mockFeaturedAttractions = [
  {
    id: 1,
    type: "attraction",
    title: "Macomb Recreation Center",
    description: "Modern recreational facility with pools, fitness areas, and sports courts for the entire family.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
    category: "Recreation",
    address: "20699 Macomb St, Macomb, MI",
    rating: 4.7,
    featured: true,
  },
  {
    id: 2,
    type: "attraction",
    title: "Stony Creek Metropark",
    description: "Sprawling 4,500-acre park featuring hiking trails, beaches, golf course and winter activities.",
    image: "https://images.unsplash.com/photo-1565019001235-1acb0fc40dbb?q=80&w=800",
    category: "Outdoors",
    address: "4300 Main Park Rd, Shelby Township, MI",
    rating: 4.8,
  },
  {
    id: 3,
    type: "attraction",
    title: "Partridge Creek Mall",
    description: "Open-air shopping center with upscale stores, restaurants and pet-friendly atmosphere.",
    image: "https://images.unsplash.com/photo-1605725657590-b2cf0d31872b?q=80&w=800",
    category: "Shopping",
    address: "17420 Hall Rd, Clinton Township, MI",
    rating: 4.6,
  },
];

const mockEvents = [
  {
    id: 1,
    type: "event",
    title: "Macomb Days Festival",
    description: "Annual community celebration with live music, food trucks, carnival rides, and local vendors.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
    category: "Festival",
    date: "2025-06-25",
    time: "10:00 AM - 9:00 PM",
    address: "Macomb Township Recreation Center, Macomb, MI",
  },
  {
    id: 2,
    type: "event",
    title: "Farmers Market at the Mall",
    description: "Weekly market featuring local produce, artisanal foods, and handcrafted goods.",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800",
    category: "Market",
    date: "2025-04-08",
    time: "9:00 AM - 2:00 PM",
    address: "The Mall at Partridge Creek, Clinton Township, MI",
  },
  {
    id: 3,
    type: "event",
    title: "Summer Concert Series",
    description: "Free outdoor concerts featuring local and regional musicians in the park.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800",
    category: "Music",
    date: "2025-04-15",
    time: "7:00 PM - 9:00 PM",
    address: "Macomb Corners Park, Macomb, MI",
  },
];

const mockRestaurants = [
  {
    id: 1,
    type: "restaurant",
    title: "Bonefish Grill",
    description: "Upscale seafood restaurant with market-fresh fish and wood-grilled specialties.",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800",
    category: "Seafood",
    address: "17380 Hall Rd, Clinton Township, MI",
    rating: 4.7,
    price: "$$$",
    phone: "(586) 412-0814",
  },
  {
    id: 2,
    type: "restaurant",
    title: "Chesterfield's Tavern",
    description: "Neighborhood pub with craft beers, comfort food, and a welcoming atmosphere.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
    category: "American",
    address: "21421 21 Mile Rd, Macomb, MI",
    rating: 4.5,
    price: "$$",
    phone: "(586) 286-8700",
  },
  {
    id: 3,
    type: "restaurant",
    title: "Antonio's Italian Cuisine",
    description: "Family-owned restaurant serving authentic Italian dishes and wood-fired pizzas.",
    image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=800",
    category: "Italian",
    address: "15750 Hall Rd, Macomb, MI",
    rating: 4.6,
    price: "$$",
    phone: "(586) 416-3388",
  },
];

// For server components, this would be replaced with actual data fetching
async function getCityData() {
  // Simulate API fetch
  return {
    name: "Macomb",
    state: "Michigan",
    population: "91,663",
    founded: 1834,
    slogan: "Discover the heart of Macomb County",
    heroImage: "https://images.unsplash.com/photo-1614805379000-c51d1608cce9?q=80&w=1600",
  };
}

export default async function Home() {
  const cityData = await getCityData();
  
  // Prepare carousel items
  const carouselItems = [
    ...mockFeaturedAttractions,
    ...mockEvents
  ].slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Search */}
      <Hero 
        title={`Discover ${cityData.name}`}
        subtitle={cityData.slogan}
        backgroundImage={cityData.heroImage}
      />

      {/* Quick Navigation Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: "Attractions", icon: <Landmark className="h-6 w-6" />, href: "/attractions" },
              { title: "Events", icon: <Calendar className="h-6 w-6" />, href: "/events" },
              { title: "Dining", icon: <Utensils className="h-6 w-6" />, href: "/dining" },
              { title: "Real Estate", icon: <Building className="h-6 w-6" />, href: "/real-estate" },
              { title: "Transportation", icon: <Bus className="h-6 w-6" />, href: "/transportation" },
            ].map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href}
                className="flex flex-col items-center p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                  {item.icon}
                </div>
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* City Overview */}
      <section className="container py-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to {cityData.name}, {cityData.state}</h1>
            <p className="text-muted-foreground">
              Nestled in the heart of Macomb County, Michigan, our vibrant township offers the perfect 
              blend of suburban comfort and urban amenities. With beautiful parks, excellent schools, 
              diverse dining, and convenient shopping, Macomb Township is a wonderful place to live, 
              work, and visit.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-muted px-4 py-2 rounded-md">
                <span className="font-semibold">Population:</span> {cityData.population}
              </div>
              <div className="bg-muted px-4 py-2 rounded-md">
                <span className="font-semibold">Founded:</span> {cityData.founded}
              </div>
              <div className="bg-muted px-4 py-2 rounded-md">
                <span className="font-semibold">County:</span> Macomb
              </div>
            </div>
            <Link href="/about">
              <Button variant="outline" className="mt-2">
                Learn more about Macomb
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[300px] relative rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=800"
              alt={cityData.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Content with Tabs */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-6">Explore Macomb</h2>
        <Tabs defaultValue="attractions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="attractions">Popular Attractions</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="dining">Featured Dining</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attractions" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {mockFeaturedAttractions.map(attraction => (
                  <Card key={attraction.id} {...attraction} />
                ))}
              </Suspense>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/attractions">
                <Button>
                  View All Attractions
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {mockEvents.map(event => (
                  <Card key={event.id} {...event} />
                ))}
              </Suspense>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/events">
                <Button>
                  View All Events
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="dining" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {mockRestaurants.map(restaurant => (
                  <Card key={restaurant.id} {...restaurant} />
                ))}
              </Suspense>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/dining">
                <Button>
                  View All Restaurants
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Featured Carousel Section - Now using a client component */}
      <ClientCarouselSection items={carouselItems} />

      {/* Local Highlights with HoverCard */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">Local Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Macomb Community College",
              image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800",
              description: "A top community college offering 200+ degree and certificate programs to over 20,000 students.",
              link: "https://www.macomb.edu/"
            },
            {
              title: "Suburban Collection Showplace",
              image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800",
              description: "Premier event venue hosting conferences, trade shows, and special events year-round.",
              link: "/attractions"
            },
            {
              title: "Macomb Orchard Trail",
              image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800",
              description: "A scenic 24-mile paved trail perfect for biking, walking, and running through beautiful landscapes.",
              link: "/attractions"
            },
            {
              title: "Lake St. Clair",
              image: "https://images.unsplash.com/photo-1592870230659-9ce24352006f?q=80&w=800", 
              description: "Beautiful freshwater lake offering boating, fishing, and waterfront recreation just minutes away.",
              link: "/attractions"
            },
          ].map((item, idx) => (
            <div key={idx} className="group">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link href={item.link} className="block overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg">
                    <div className="h-48 w-full relative">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4 bg-background">
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <Link href={item.link} className="text-sm text-primary hover:underline">
                      Learn more
                    </Link>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-16 mt-8">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Plan Your Visit to Macomb</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Whether you're a resident, new to the area, or just visiting, Macomb Township offers countless opportunities for recreation, dining, and entertainment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/attractions">
              <Button variant="secondary" size="lg">
                Explore Attractions
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="secondary" size="lg">
                View Events
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
