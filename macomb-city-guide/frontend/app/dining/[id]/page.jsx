import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Star, 
  Utensils, 
  DollarSign, 
  ArrowLeft, 
  ChevronRight 
} from "lucide-react";

// Components
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddToFavoritesButton from "@/components/AddToFavoritesButton";
import ShareMenu from "@/components/ShareMenu";
import ReviewForm from "@/components/ReviewForm";
import RestaurantMap from "./RestaurantMap";
import ReviewCard from "./ReviewCard";

// This would be replaced with a real API call
async function getRestaurant(id) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sample restaurant data - in production this would come from your API
  const restaurants = [
    {
      id: "1",
      type: "restaurant",
      title: "Bonefish Grill",
      description: "Upscale seafood restaurant with market-fresh fish and wood-grilled specialties.",
      longDescription: "Bonefish Grill is an upscale seafood restaurant chain known for its market-fresh fish, wood-grilled specialties, and hand-crafted cocktails. The restaurant prides itself on sourcing the highest quality seafood from around the world and preparing it with simple, pure ingredients that enhance its natural flavors.\n\nGuests can enjoy a wide variety of fish species that rotate based on seasonal availability, each prepared over a wood-burning grill and topped with a choice of signature sauces. Beyond seafood, the menu features premium steaks, pork chops, and chicken dishes to satisfy all tastes.\n\nThe restaurant's modern, yet comfortable atmosphere makes it ideal for both special occasions and casual dining. The knowledgeable staff can guide guests through the menu, helping them select the perfect dish and complementary wine or cocktail.\n\nBonefish Grill also offers a popular \"Bang Bang Shrimp\" appetizer—crispy shrimp tossed in a creamy, spicy sauce that has developed a cult following among regular patrons.",
      image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800",
      images: [
        "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800",
        "https://images.unsplash.com/photo-1599458252573-56ae36120de1?q=80&w=800",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800"
      ],
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
      latitude: 42.6218,
      longitude: -82.9665,
      featured: true,
      amenities: ["Full Bar", "Outdoor Seating", "Private Dining", "Takeout", "Online Reservations"],
      reviews: [
        { 
          id: "r1", 
          author: "Jessica M.", 
          rating: 5, 
          date: "2024-01-15", 
          comment: "Absolutely love their Bang Bang Shrimp! Always fresh seafood and excellent service."
        },
        { 
          id: "r2", 
          author: "Michael T.", 
          rating: 4, 
          date: "2023-12-03", 
          comment: "Great atmosphere and delicious food. The Chilean Sea Bass was perfectly cooked."
        },
        { 
          id: "r3", 
          author: "Sarah K.", 
          rating: 5, 
          date: "2023-11-17", 
          comment: "My go-to place for special occasions. The cocktails are just as impressive as the food."
        }
      ],
      menu: {
        starters: [
          { name: "Bang Bang Shrimp", description: "Crispy shrimp tossed in a creamy, spicy sauce", price: 13.9 },
          { name: "Ahi Tuna Sashimi", description: "Sesame-seared rare tuna with wasabi and pickled ginger", price: 14.5 },
          { name: "Calamari", description: "Flash-fried with peppers and sweet, spicy Asian sauce", price: 12.9 }
        ],
        mains: [
          { name: "Atlantic Salmon", description: "Wood-grilled fresh salmon with choice of signature sauce", price: 25.9 },
          { name: "Chilean Sea Bass", description: "Wood-grilled with mango salsa", price: 34.9 },
          { name: "Filet Mignon", description: "7oz center-cut filet, wood-grilled", price: 31.9 }
        ],
        desserts: [
          { name: "Macadamia Nut Brownie", description: "With vanilla ice cream and raspberry sauce", price: 8.9 },
          { name: "Key Lime Pie", description: "Classic tart and sweet with fresh whipped cream", price: 8.5 }
        ]
      }
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
    }
  ];
  
  const restaurant = restaurants.find(restaurant => restaurant.id === id);
  
  if (!restaurant) {
    return null;
  }
  
  return restaurant;
}

// Get similar restaurants (same cuisine or category)
async function getSimilarRestaurants(restaurantId, cuisine) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Sample restaurants data - in production this would come from your API
  const restaurants = [
    {
      id: "3",
      type: "restaurant",
      title: "Testa Barra",
      description: "Modern Italian restaurant serving fresh pasta, wood-fired pizzas, and craft cocktails in a stylish space.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
      category: "Fine Dining",
      cuisine: "Italian",
      rating: 4.8,
      price: "$$$",
    },
    {
      id: "8",
      type: "restaurant",
      title: "Sushi Zen",
      description: "Modern Japanese restaurant with a broad selection of sushi, sashimi, and specialty rolls.",
      image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=800",
      category: "Casual Dining",
      cuisine: "Japanese",
      rating: 4.6,
      price: "$$",
    },
    {
      id: "10",
      type: "restaurant",
      title: "Andiamo",
      description: "Upscale Italian restaurant known for its handmade pasta and extensive wine list.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
      category: "Fine Dining",
      cuisine: "Italian",
      rating: 4.6,
      price: "$$$",
    }
  ];
  
  // Filter out the current restaurant and show restaurants with same cuisine or category
  return restaurants.filter(restaurant => restaurant.id !== restaurantId).slice(0, 3);
}

export default async function RestaurantPage({ params }) {
  const restaurant = await getRestaurant(params.id);
  
  // Handle restaurant not found
  if (!restaurant) {
    notFound();
  }
  
  // Fetch similar restaurants
  const similarRestaurants = await getSimilarRestaurants(params.id, restaurant.cuisine);
  
  return (
    <div className="container py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/restaurants" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all restaurants
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{restaurant.cuisine}</Badge>
              <Badge variant="outline">{restaurant.category}</Badge>
              <Badge variant="secondary">{restaurant.price}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{restaurant.title}</h1>
            
            <div className="flex flex-col sm:flex-row gap-y-2 gap-x-6 text-sm text-muted-foreground mb-3">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {restaurant.address}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {restaurant.hours}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{restaurant.rating}</span>
                <span className="ml-1 text-muted-foreground">({restaurant.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Restaurant Images */}
          <div className="mb-8">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-2">
              <Image
                src={restaurant.images?.[0] || restaurant.image}
                alt={restaurant.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {restaurant.images && restaurant.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {restaurant.images.slice(1, 4).map((img, idx) => (
                  <div key={idx} className="aspect-[16/9] relative rounded-md overflow-hidden">
                    <Image
                      src={img}
                      alt={`${restaurant.title} image ${idx + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Restaurant Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="text-muted-foreground whitespace-pre-line">
              {restaurant.longDescription || restaurant.description}
            </div>
          </div>
          
          {/* Menu Section */}
          {restaurant.menu && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Menu Highlights</h2>
              <div className="space-y-6">
                {restaurant.menu.starters && (
                  <div>
                    <h3 className="font-medium mb-3">Starters</h3>
                    <div className="space-y-3">
                      {restaurant.menu.starters.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {restaurant.menu.mains && (
                  <div>
                    <h3 className="font-medium mb-3">Main Courses</h3>
                    <div className="space-y-3">
                      {restaurant.menu.mains.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {restaurant.menu.desserts && (
                  <div>
                    <h3 className="font-medium mb-3">Desserts</h3>
                    <div className="space-y-3">
                      {restaurant.menu.desserts.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>* Menu items and prices subject to change. This is a sample of our offerings.</p>
              </div>
            </div>
          )}
          
          {/* Amenities */}
          {restaurant.amenities && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {restaurant.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                    <span>{amenity}</span>
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
                  <p className="font-medium">{restaurant.title}</p>
                  <p className="text-muted-foreground">{restaurant.address}</p>
                </div>
              </div>
              
              <div className="mt-4 aspect-[16/9] bg-accent/50 rounded-md">
                <RestaurantMap 
                  latitude={restaurant.latitude || 42.6675} 
                  longitude={restaurant.longitude || -82.9400} 
                  title={restaurant.title}
                />
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            
            <div className="mb-8">
              <ReviewForm itemId={restaurant.id} itemType="restaurant" />
            </div>
            
            <div className="space-y-4">
              {restaurant.reviews && restaurant.reviews.length > 0 ? (
                restaurant.reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Action Card */}
          <div className="bg-card border rounded-lg shadow-sm p-6 mb-6">
            {/* Price Level */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Price Range</p>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{restaurant.price}</span>
                <span className="ml-2 text-muted-foreground">• {
                  restaurant.priceLevel === 1 ? "Inexpensive" :
                  restaurant.priceLevel === 2 ? "Moderate" :
                  "Expensive"
                }</span>
              </div>
            </div>
            
            {/* Hours */}
            <div className="flex items-start mb-6">
              <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium">Opening Hours</p>
                <p className="text-sm text-muted-foreground">{restaurant.hours}</p>
              </div>
            </div>
            
            {/* Contact */}
            <div className="flex items-start mb-6">
              <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium">Contact</p>
                <a href={`tel:${restaurant.phone}`} className="text-sm text-primary hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            </div>
            
            {/* Website */}
            {restaurant.website && (
              <div className="flex items-start mb-6">
                <Globe className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              </div>
            )}
            
            {/* Add to Favorites Button */}
            <AddToFavoritesButton 
              itemId={restaurant.id}
              itemType="restaurant"
              title={restaurant.title}
              image={restaurant.image}
            />
            
            <Separator className="my-6" />
            
            {/* Reserve Button */}
            <Button className="w-full mb-4" asChild>
              <a 
                href={restaurant.website || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Make a Reservation
              </a>
            </Button>
            
            {/* Share Button */}
            <ShareMenu url={`/restaurants/${restaurant.id}`} title={restaurant.title} />
          </div>
          
          {/* Cuisine Info */}
          <div className="bg-card border rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Utensils className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Cuisine Information</h3>
            </div>
            
            <div>
              <p className="mb-2">
                <span className="font-medium">Type:</span> {restaurant.cuisine}
              </p>
              <p className="mb-2">
                <span className="font-medium">Category:</span> {restaurant.category}
              </p>
              <p className="mb-2">
                <span className="font-medium">Price Level:</span> {restaurant.price} ({
                  restaurant.priceLevel === 1 ? "Inexpensive" :
                  restaurant.priceLevel === 2 ? "Moderate" :
                  "Expensive"
                })
              </p>
              
              <div className="mt-4">
                <Link 
                  href={`/restaurants?cuisine=${restaurant.cuisine.toLowerCase()}`}
                  className="text-primary flex items-center text-sm hover:underline"
                >
                  See more {restaurant.cuisine} restaurants
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Restaurants */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">You Might Also Like</h2>
          <Link href="/restaurants" className="text-primary flex items-center hover:underline">
            View all restaurants
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            {similarRestaurants.map((restaurant) => (
              <Card key={restaurant.id} {...restaurant} />
            ))}
          </Suspense>
        </div>
      </section>
    </div>
  );
}