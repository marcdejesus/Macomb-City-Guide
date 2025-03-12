import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, Clock, Globe, Phone, Calendar, Share2, 
  Star, ArrowLeft, ChevronRight 
} from "lucide-react";

import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Client components (to be imported)
import AddToFavoritesButton from "@/components/AddToFavoritesButton";
import AttractionMap from "@/components/AttractionMap";
import ReviewForm from "@/components/ReviewForm";
import ShareMenu from "@/components/ShareMenu";

// This would be replaced with a real API call in production
async function getAttraction(id) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock attraction data based on backend model
  const attraction = {
    id: parseInt(id),
    type: "attraction",
    title: "Macomb Recreation Center", // Name in backend
    description: "Modern recreational facility with pools, fitness areas, and sports courts for the entire family. Located in the heart of Macomb Township, the Recreation Center offers state-of-the-art fitness equipment, swimming pools for all ages, basketball courts, and various recreational programs for the community.",
    history: "Established in 2005, the Macomb Recreation Center was built to provide residents with a centralized location for fitness and leisure activities. The facility underwent a major expansion in 2015, adding an indoor track, additional pool facilities, and modern exercise equipment.",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
      "https://images.unsplash.com/photo-1576013551627-0ae7d1d192f7?q=80&w=800",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800", 
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800"
    ],
    category: "Recreation", // Category in backend
    address: "20699 Macomb St, Macomb, MI", // Address in backend
    phone: "(586) 992-2900",
    website: "https://www.macombmi.gov/recreation",
    openingHours: "Monday-Friday: 6am-9pm, Saturday-Sunday: 8am-6pm", // opening_hours in backend
    rating: 4.7,
    reviewCount: 124,
    latitude: 42.6675,
    longitude: -82.9400,
    featured: true,
    city: "Macomb",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-12-10T15:30:00Z",
    amenities: ["Swimming Pool", "Fitness Center", "Basketball Courts", "Indoor Track", "Locker Rooms", "Free Parking"]
  };
  
  // Return 404 if ID doesn't match (simulating not found)
  if (id === "1" || id === "2" || id === "3") {
    return attraction;
  }
  
  return null;
}

async function getNearbyAttractions(id, category, city) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock nearby attractions based on same category and city
  return [
    {
      id: 7,
      type: "attraction",
      title: "Macomb Orchard Trail",
      description: "24-mile linear park and trail for biking, walking, and running through scenic landscapes.",
      image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800",
      category: "Recreation",
      address: "Macomb County, MI",
      rating: 4.7,
    },
    {
      id: 9,
      type: "attraction",
      title: "Cherry Creek Golf Club",
      description: "Premier 18-hole championship golf course with scenic views and country club amenities.",
      image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800",
      category: "Recreation",
      address: "52000 Cherry Creek Dr, Shelby Township, MI",
      rating: 4.6,
    },
    {
      id: 11,
      type: "attraction",
      title: "Jimmy John's Field",
      description: "Minor league baseball stadium hosting United Shore Professional Baseball League games.",
      image: "https://images.unsplash.com/photo-1562490604-bcfb3298f36f?q=80&w=800",
      category: "Sports",
      address: "7171 Auburn Rd, Utica, MI",
      rating: 4.7,
    }
  ];
}

async function getAttractionReviews(id) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock reviews data
  return [
    {
      id: 1,
      author: "Emma Johnson",
      avatar: "https://i.pravatar.cc/150?u=emma",
      rating: 5,
      date: "2023-12-10T14:30:00Z",
      comment: "The recreation center has something for everyone in the family. My kids love the pool area with the slides, while I enjoy using the fitness equipment. The staff is friendly and the facilities are always clean. Highly recommend getting a membership if you live in Macomb!",
    },
    {
      id: 2,
      author: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=michael",
      rating: 4,
      date: "2023-11-22T09:45:00Z",
      comment: "Great facility overall. The basketball courts are well-maintained and there's usually a good crowd for pickup games on weekends. My only complaint would be that the locker rooms could use an update.",
    },
    {
      id: 3,
      author: "Sophia Rodriguez",
      avatar: "https://i.pravatar.cc/150?u=sophia",
      rating: 5,
      date: "2023-10-05T16:20:00Z",
      comment: "I take swimming classes here twice a week and I'm really impressed with the quality of instruction. The pool area is clean and well-maintained. The temperature is always perfect!",
    },
    {
      id: 4,
      author: "James Wilson",
      avatar: "https://i.pravatar.cc/150?u=james",
      rating: 4,
      date: "2023-09-18T11:15:00Z",
      comment: "I use the indoor track regularly during winter months. It gets a bit crowded during peak hours but overall it's a great place to stay active when the weather doesn't cooperate.",
    }
  ];
}

export default async function AttractionPage({ params }) {
  const attraction = await getAttraction(params.id);
  
  // Handle not found attraction
  if (!attraction) {
    notFound();
  }
  
  // Fetch related data in parallel
  const [nearbyAttractions, reviews] = await Promise.all([
    getNearbyAttractions(params.id, attraction.category, attraction.city),
    getAttractionReviews(params.id)
  ]);
  
  // Calculate average rating from reviews
  const avgReviewRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  return (
    <div className="container py-8">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm mb-6">
        <Link href="/attractions" className="text-muted-foreground hover:text-primary flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all attractions
        </Link>
      </nav>
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery - Main Image */}
        <div className="space-y-4">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image 
              src={attraction.images[0]} 
              alt={attraction.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Thumbnail Row */}
          <div className="grid grid-cols-3 gap-2">
            {attraction.images.slice(1, 4).map((img, idx) => (
              <div key={idx} className="relative h-24 rounded-md overflow-hidden">
                <Image 
                  src={img} 
                  alt={`${attraction.title} image ${idx + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Attraction Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{attraction.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{attraction.category}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{attraction.rating}</span>
                  <span className="text-muted-foreground ml-1">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShareMenu url={`/attractions/${attraction.id}`} title={attraction.title} />
              <AddToFavoritesButton id={attraction.id} type="attraction" />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{attraction.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{attraction.openingHours}</span>
            </div>
            {attraction.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{attraction.phone}</span>
              </div>
            )}
            {attraction.website && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <a href={attraction.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Visit website
                </a>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>Added on {new Date(attraction.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="pt-4">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-muted-foreground">
              {attraction.description}
            </p>
          </div>
          
          {/* Amenities */}
          {attraction.amenities && attraction.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {attraction.amenities.map((amenity, idx) => (
                  <Badge key={idx} variant="secondary">{amenity}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <Button size="lg">
              Get Directions
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabbed Content Section */}
      <Tabs defaultValue="details" className="mt-12">
        <TabsList className="mb-8">
          <TabsTrigger value="details">Details & History</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="map">Location & Map</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">History</h2>
            <p className="text-muted-foreground">
              {attraction.history || "No detailed history available for this attraction."}
            </p>
          </div>
          
          {/* Any additional details would go here */}
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-8">
          {/* Review Summary */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="text-center md:border-r md:pr-8 md:border-border">
                <div className="text-5xl font-bold">{avgReviewRating.toFixed(1)}</div>
                <div className="mt-1 flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(avgReviewRating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-muted stroke-muted-foreground fill-muted"}`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Based on {reviews.length} reviews
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
                
                {/* Rating Bars */}
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length * 100) : 0;
                  
                  return (
                    <div key={rating} className="flex items-center mb-2">
                      <div className="w-10 text-sm">{rating} star</div>
                      <div className="flex-1 mx-3 h-2 bg-muted rounded">
                        <div 
                          className="h-full bg-yellow-400 rounded" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-8 text-sm text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Write a review section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <ReviewForm attractionId={attraction.id} />
          </div>
          
          {/* Reviews List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6">
                  <div className="flex gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image 
                        src={review.avatar}
                        alt={review.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{review.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-muted stroke-muted-foreground fill-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Map Tab */}
        <TabsContent value="map">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Location</h2>
            <div className="h-[500px] relative bg-muted rounded-lg overflow-hidden">
              <AttractionMap 
                latitude={attraction.latitude}
                longitude={attraction.longitude} 
                title={attraction.title}
                address={attraction.address}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Nearby Attractions */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Nearby Attractions</h2>
          <Link href="/attractions" className="text-primary flex items-center hover:underline">
            View all attractions
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            {nearbyAttractions.map((attraction) => (
              <Card key={attraction.id} {...attraction} />
            ))}
          </Suspense>
        </div>
      </section>
    </div>
  );
}