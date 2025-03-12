import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Clock,
  Star
} from "lucide-react";

import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClientPaginationSection from "@/components/ClientPaginationSection";
import FilterBar from "@/components/restaurants/FilterBar";
import ClearFiltersButton from "@/components/restaurants/ClearFiltersButton";

// This would be replaced with a real API call in production
async function getRestaurants(searchParams) {
  // Simulate a delay as if fetching from an API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Extract search parameters with defaults
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || "";
  const cuisine = searchParams?.cuisine || "";
  const sort = searchParams?.sort || "rating-desc";
  const priceRange = searchParams?.price || "";
  const featured = searchParams?.featured === "true";

  // Mock data for restaurants
  const allRestaurants = [
    {
      id: "1",
      type: "restaurant",
      title: "Bonefish Grill",
      description: "Upscale seafood restaurant with market-fresh fish and wood-grilled specialties in a polished setting.",
      image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800",
      category: "Seafood",
      cuisine: "Seafood",
      address: "17380 Hall Rd, Clinton Township, MI",
      rating: 4.7,
      reviewCount: 312,
      price: "$$$",
      priceLevel: 3,
      hours: "Mon-Thu: 4pm-10pm, Fri-Sat: 11am-11pm, Sun: 11am-9pm",
      phone: "(586) 412-0814",
      website: "https://www.bonefishgrill.com",
      featured: true
    },
    {
      id: "2",
      type: "restaurant",
      title: "Chesterfield Tavern",
      description: "Neighborhood pub with craft beers, comfort food, and a welcoming atmosphere.",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
      category: "Pub",
      cuisine: "American",
      address: "21421 21 Mile Rd, Macomb, MI",
      rating: 4.5,
      reviewCount: 178,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Sun: 11am-12am",
      phone: "(586) 598-9500",
      featured: false
    },
    {
      id: "3",
      type: "restaurant",
      title: "Testa Barra",
      description: "Modern Italian restaurant serving fresh pasta, wood-fired pizzas, and craft cocktails in a stylish space.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
      category: "Fine Dining",
      cuisine: "Italian",
      address: "48824 Romeo Plank Rd, Macomb, MI",
      rating: 4.8,
      reviewCount: 226,
      price: "$$$",
      priceLevel: 3,
      hours: "Tue-Thu: 4pm-9pm, Fri-Sat: 4pm-10pm, Sun: 4pm-8pm, Mon: Closed",
      phone: "(586) 434-0100",
      featured: true
    },
    {
      id: "4",
      type: "restaurant",
      title: "Bangkok Cuisine",
      description: "Authentic Thai dishes served in a relaxed setting with colorful decor.",
      image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Thai",
      address: "45125 Hayes Rd, Macomb, MI",
      rating: 4.3,
      reviewCount: 143,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Fri: 11am-9pm, Sat-Sun: 12pm-9pm",
      phone: "(586) 226-8288",
      featured: false
    },
    {
      id: "5",
      type: "restaurant",
      title: "Golden Chopsticks",
      description: "Family-owned Chinese restaurant offering traditional dishes and dim sum in a comfortable setting.",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Chinese",
      address: "18230 Hall Rd, Macomb, MI",
      rating: 4.2,
      reviewCount: 187,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Thu: 11am-9:30pm, Fri-Sat: 11am-10:30pm, Sun: 12pm-9pm",
      phone: "(586) 263-8818",
      featured: false
    },
    {
      id: "6",
      type: "restaurant",
      title: "Mi Pueblo",
      description: "Vibrant Mexican restaurant with a vast menu of authentic dishes, margaritas, and festive atmosphere.",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479b?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Mexican",
      address: "47720 Van Dyke Ave, Shelby Township, MI",
      rating: 4.6,
      reviewCount: 256,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Thu: 11am-10pm, Fri-Sat: 11am-11pm, Sun: 11am-9pm",
      phone: "(586) 254-8600",
      featured: true
    },
    {
      id: "7",
      type: "restaurant",
      title: "Olive Garden",
      description: "Family-friendly restaurant chain featuring Italian-American cuisine with unlimited breadsticks.",
      image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Italian",
      address: "45655 Utica Park Blvd, Utica, MI",
      rating: 4.1,
      reviewCount: 322,
      price: "$$",
      priceLevel: 2,
      hours: "Sun-Thu: 11am-10pm, Fri-Sat: 11am-11pm",
      phone: "(586) 997-9081",
      featured: false
    },
    {
      id: "8",
      type: "restaurant",
      title: "Sushi Zen",
      description: "Modern Japanese restaurant with a broad selection of sushi, sashimi, and specialty rolls.",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800",
      category: "Fine Dining",
      cuisine: "Japanese",
      address: "45120 Garfield Rd, Clinton Township, MI",
      rating: 4.7,
      reviewCount: 198,
      price: "$$$",
      priceLevel: 3,
      hours: "Mon-Fri: 11:30am-2:30pm, 4:30pm-9:30pm, Sat: 1pm-10pm, Sun: Closed",
      phone: "(586) 412-5700",
      featured: true
    },
    {
      id: "9",
      type: "restaurant",
      title: "Red Olive",
      description: "Mediterranean and American dishes served in a casual, family-friendly environment.",
      image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Mediterranean",
      address: "51110 Van Dyke Ave, Shelby Township, MI",
      rating: 4.2,
      reviewCount: 156,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Sun: 7am-9pm",
      phone: "(586) 991-5100",
      featured: false
    },
    {
      id: "10",
      type: "restaurant",
      title: "Andiamo",
      description: "Upscale Italian restaurant known for its handmade pasta and extensive wine list.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
      category: "Fine Dining",
      cuisine: "Italian",
      address: "7096 E 14 Mile Rd, Warren, MI",
      rating: 4.6,
      reviewCount: 276,
      price: "$$$",
      priceLevel: 3,
      hours: "Mon-Thu: 4pm-10pm, Fri-Sat: 4pm-11pm, Sun: 4pm-9pm",
      phone: "(586) 268-3200",
      featured: true
    },
    {
      id: "11",
      type: "restaurant",
      title: "Pacific Rim",
      description: "Pan-Asian cuisine featuring Chinese, Thai and Japanese flavors in a modern space.",
      image: "https://images.unsplash.com/photo-1565299715199-866c917206bb?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Asian",
      address: "48675 Van Dyke Ave, Shelby Township, MI",
      rating: 4.3,
      reviewCount: 188,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Thu: 11am-9:30pm, Fri-Sat: 11am-10:30pm, Sun: 12pm-9pm",
      phone: "(586) 997-9760",
      featured: false
    },
    {
      id: "12",
      type: "restaurant",
      title: "The Pantry",
      description: "Charming breakfast and lunch spot serving homestyle cooking and fresh-baked goods.",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800",
      category: "Breakfast",
      cuisine: "American",
      address: "53110 Hayes Rd, Macomb, MI",
      rating: 4.8,
      reviewCount: 163,
      price: "$",
      priceLevel: 1,
      hours: "Mon-Fri: 7am-3pm, Sat-Sun: 7am-4pm",
      phone: "(586) 884-4199",
      featured: false
    },
    {
      id: "13",
      type: "restaurant",
      title: "Three Brothers Pizzeria",
      description: "Family-owned pizzeria serving hand-tossed pies, calzones, and Italian favorites.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
      category: "Pizza",
      cuisine: "Italian",
      address: "42065 Garfield Rd, Clinton Township, MI",
      rating: 4.5,
      reviewCount: 221,
      price: "$",
      priceLevel: 1,
      hours: "Mon-Thu: 11am-10pm, Fri-Sat: 11am-11pm, Sun: 12pm-9pm",
      phone: "(586) 263-7700",
      featured: false
    },
    {
      id: "14",
      type: "restaurant",
      title: "Sahara Mediterranean Grill",
      description: "Middle Eastern restaurant known for flavorful dishes, fresh bread, and generous portions.",
      image: "https://images.unsplash.com/photo-1544397301-908398edf06a?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Mediterranean",
      address: "16415 Hall Rd, Macomb, MI",
      rating: 4.6,
      reviewCount: 192,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Sun: 10am-10pm",
      phone: "(586) 566-9999",
      featured: true
    },
    {
      id: "15",
      type: "restaurant",
      title: "Brown Iron Brewhouse",
      description: "Rustic brewery and restaurant offering craft beers and smokehouse meats.",
      image: "https://images.unsplash.com/photo-1546622891-02c72c1537b6?q=80&w=800",
      category: "Brewpub",
      cuisine: "American",
      address: "57695 Van Dyke Ave, Washington, MI",
      rating: 4.7,
      reviewCount: 287,
      price: "$$",
      priceLevel: 2,
      hours: "Mon-Thu: 11am-10pm, Fri-Sat: 11am-11pm, Sun: 10am-9pm",
      phone: "(586) 697-3300",
      featured: true
    },
    {
      id: "16",
      type: "restaurant",
      title: "Noodles & Company",
      description: "Fast-casual chain offering international noodle and pasta dishes in a friendly environment.",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800",
      category: "Fast Casual",
      cuisine: "International",
      address: "50670 Gratiot Ave, Chesterfield, MI",
      rating: 4.0,
      reviewCount: 145,
      price: "$",
      priceLevel: 1,
      hours: "Mon-Sun: 11am-9pm",
      phone: "(586) 948-9100",
      featured: false
    }
  ];

  // Filter by search term
  let filteredRestaurants = [...allRestaurants];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(
      restaurant => 
        restaurant.title.toLowerCase().includes(searchLower) ||
        restaurant.description.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by cuisine
  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter(
      restaurant => restaurant.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  }
  
  // Filter by price range
  if (priceRange) {
    const priceLevel = priceRange.length; // $, $$, or $$$
    filteredRestaurants = filteredRestaurants.filter(
      restaurant => restaurant.priceLevel === priceLevel
    );
  }
  
  // Filter featured
  if (featured) {
    filteredRestaurants = filteredRestaurants.filter(
      restaurant => restaurant.featured
    );
  }
  
  // Sort restaurants
  switch (sort) {
    case 'name-asc':
      filteredRestaurants.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      filteredRestaurants.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'rating-asc':
      filteredRestaurants.sort((a, b) => a.rating - b.rating);
      break;
    case 'rating-desc':
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-asc':
      filteredRestaurants.sort((a, b) => a.priceLevel - b.priceLevel);
      break;
    case 'price-desc':
      filteredRestaurants.sort((a, b) => b.priceLevel - a.priceLevel);
      break;
    default:
      // Default sort by rating (highest first)
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
  }
  
  // Calculate pagination
  const totalRestaurants = filteredRestaurants.length;
  const totalPages = Math.ceil(totalRestaurants / limit);
  const offset = (page - 1) * limit;
  const paginatedRestaurants = filteredRestaurants.slice(offset, offset + limit);
  
  return {
    restaurants: paginatedRestaurants,
    totalRestaurants,
    totalPages,
    currentPage: page
  };
}

// This would also come from an API
async function getCuisines() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { id: 1, name: "American" },
    { id: 2, name: "Italian" },
    { id: 3, name: "Chinese" },
    { id: 4, name: "Japanese" },
    { id: 5, name: "Thai" },
    { id: 6, name: "Mexican" },
    { id: 7, name: "Mediterranean" },
    { id: 8, name: "Seafood" },
    { id: 9, name: "Asian" },
  ];
}

export default async function RestaurantsPage({ searchParams }) {
  const { restaurants, totalRestaurants, totalPages, currentPage } = await getRestaurants(searchParams);
  const cuisines = await getCuisines();
  
  const selectedCuisine = searchParams?.cuisine || '';
  const selectedSort = searchParams?.sort || 'rating-desc';
  const selectedPrice = searchParams?.price || '';
  const displayMode = searchParams?.display || 'grid';
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Restaurants in Macomb</h1>
        <p className="text-muted-foreground">Explore {totalRestaurants} dining options in Macomb and the surrounding area</p>
      </div>
      
      {/* Filters Section - now a client component */}
      <FilterBar 
        searchParams={searchParams}
        cuisines={cuisines}
        selectedCuisine={selectedCuisine}
        selectedPrice={selectedPrice}
        selectedSort={selectedSort}
        displayMode={displayMode}
      />
      
      {/* Restaurant Cards */}
      {restaurants.length > 0 ? (
        <div className={
          displayMode === 'list' 
            ? "flex flex-col space-y-4" 
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          <Suspense fallback={<LoadingSpinner />}>
            {displayMode === 'list' ? (
              // List view
              restaurants.map((restaurant) => (
                <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
                  <div className="flex border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-1/3 relative">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={restaurant.image}
                          alt={restaurant.title}
                          fill
                          className="object-cover rounded-l-lg"
                        />
                      </div>
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{restaurant.title}</h3>
                        <span className="text-sm">{restaurant.price}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="flex items-center">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                          {restaurant.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                        <Badge variant="outline" className="ml-2 text-xs">{restaurant.cuisine}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{restaurant.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {restaurant.address}
                      </div>
                      
                      {/* Hours information */}
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {restaurant.hours}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Grid view
              restaurants.map((restaurant) => (
                <Card key={restaurant.id} {...restaurant} />
              ))
            )}
          </Suspense>
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium">No restaurants found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
          <ClearFiltersButton />
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <ClientPaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
          />
        </div>
      )}
      
      {/* Featured Restaurants Section */}
      {!selectedCuisine && !selectedPrice && !searchParams?.search && currentPage === 1 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Restaurants</h2>
          <Tabs defaultValue="fine-dining">
            <TabsList className="mb-6">
              <TabsTrigger value="fine-dining">Fine Dining</TabsTrigger>
              <TabsTrigger value="casual">Casual</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
            </TabsList>
            <TabsContent value="fine-dining" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  {restaurants
                    .filter(r => r.category === "Fine Dining")
                    .slice(0, 3)
                    .map(restaurant => (
                      <Card key={restaurant.id} {...restaurant} />
                    ))
                  }
                </Suspense>
              </div>
            </TabsContent>
            <TabsContent value="casual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  {restaurants
                    .filter(r => r.category === "Casual Dining" || r.category === "Pub")
                    .slice(0, 3)
                    .map(restaurant => (
                      <Card key={restaurant.id} {...restaurant} />
                    ))
                  }
                </Suspense>
              </div>
            </TabsContent>
            <TabsContent value="international" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  {restaurants
                    .filter(r => ["Thai", "Japanese", "Chinese", "Mediterranean", "Mexican", "Asian"].includes(r.cuisine))
                    .slice(0, 3)
                    .map(restaurant => (
                      <Card key={restaurant.id} {...restaurant} />
                    ))
                  }
                </Suspense>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}