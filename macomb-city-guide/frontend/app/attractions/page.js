import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Searchbar } from "@/components/Searchbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ClientPaginationSection from "@/components/ClientPaginationSection";

// This would be replaced with a real API call in production
async function getAttractions(searchParams) {
  // Simulate a delay as if fetching from an API
  await new Promise(resolve => setTimeout(resolve, 500));

  // These would come from an API
  const allAttractions = [
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
    {
      id: 4,
      type: "attraction",
      title: "Macomb Center for the Performing Arts",
      description: "Premier venue hosting concerts, Broadway shows, and cultural performances throughout the year.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
      category: "Arts",
      address: "44575 Garfield Rd, Clinton Township, MI",
      rating: 4.5,
    },
    {
      id: 5,
      type: "attraction",
      title: "Freedom Hill County Park",
      description: "Outdoor amphitheater and recreational park with concerts, festivals, and outdoor activities.",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800",
      category: "Outdoors",
      address: "14900 Metropolitan Pkwy, Sterling Heights, MI",
      rating: 4.3,
    },
    {
      id: 6,
      type: "attraction",
      title: "Lake St. Clair",
      description: "Beautiful freshwater lake perfect for boating, fishing, and waterfront recreation.",
      image: "https://images.unsplash.com/photo-1592870230659-9ce24352006f?q=80&w=800",
      category: "Outdoors",
      address: "Macomb County, MI",
      rating: 4.9,
    },
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
      id: 8,
      type: "attraction",
      title: "Macomb Township Historical Museum",
      description: "Local museum showcasing the history and heritage of Macomb Township with interactive exhibits.",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800",
      category: "Museum",
      address: "51828 Romeo Plank Rd, Macomb, MI",
      rating: 4.2,
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
      id: 10,
      type: "attraction",
      title: "Wolcott Mill Metropark",
      description: "Historic working farm and mill with educational programs, hiking trails, and equestrian facilities.",
      image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=800",
      category: "Historic",
      address: "65775 Wolcott Rd, Ray Township, MI",
      rating: 4.4,
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
    },
    {
      id: 12,
      type: "attraction",
      title: "Michigan Transit Museum",
      description: "Railroad history museum featuring vintage trains, equipment, and scenic train rides.",
      image: "https://images.unsplash.com/photo-1505850557988-d093d0248b5d?q=80&w=800",
      category: "Museum",
      address: "200 Grand Ave, Mount Clemens, MI",
      rating: 4.3,
    }
  ];

  const { search, category, sort, page = 1, featured } = searchParams;
  
  // Filter by search term
  let filteredAttractions = allAttractions;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredAttractions = filteredAttractions.filter(attraction => 
      attraction.title.toLowerCase().includes(searchLower) ||
      attraction.description.toLowerCase().includes(searchLower) ||
      attraction.address.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by category
  if (category) {
    filteredAttractions = filteredAttractions.filter(attraction => 
      attraction.category === category
    );
  }
  
  // Filter by featured
  if (featured === 'true') {
    filteredAttractions = filteredAttractions.filter(attraction => 
      attraction.featured === true
    );
  }
  
  // Sort results
  if (sort) {
    switch (sort) {
      case 'rating-high':
        filteredAttractions.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        filteredAttractions.sort((a, b) => a.rating - b.rating);
        break;
      case 'name-asc':
        filteredAttractions.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filteredAttractions.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
  }
  
  // Calculate pagination
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredAttractions.length / ITEMS_PER_PAGE);
  const currentPage = parseInt(page) || 1;
  const paginatedAttractions = filteredAttractions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
  return {
    attractions: paginatedAttractions,
    totalAttractions: filteredAttractions.length,
    totalPages,
    currentPage,
  };
}

// Define filter options for the searchbar
const attractionFilters = [
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Recreation', value: 'Recreation' },
      { label: 'Outdoors', value: 'Outdoors' },
      { label: 'Shopping', value: 'Shopping' },
      { label: 'Arts', value: 'Arts' },
      { label: 'Museum', value: 'Museum' },
      { label: 'Historic', value: 'Historic' },
      { label: 'Sports', value: 'Sports' },
    ]
  },
  {
    key: 'sort',
    label: 'Sort By',
    type: 'select',
    options: [
      { label: 'Rating (High to Low)', value: 'rating-high' },
      { label: 'Rating (Low to High)', value: 'rating-low' },
      { label: 'Name (A-Z)', value: 'name-asc' },
      { label: 'Name (Z-A)', value: 'name-desc' },
    ]
  },
  {
    key: 'featured',
    label: 'Featured Only',
    type: 'checkbox',
  }
];

export default async function AttractionsPage({ searchParams }) {
  const { attractions, totalAttractions, totalPages, currentPage } = await getAttractions(searchParams);
  
  // Build pagination params to pass to the client component
  const paginationParams = {
    currentPage,
    totalPages,
    basePath: '/attractions',
    searchParams: {
      search: searchParams.search,
      category: searchParams.category,
      sort: searchParams.sort,
      featured: searchParams.featured
    }
  };
  
  return (
    <div className="container py-8 min-h-screen">
      {/* Page header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Attractions in Macomb</h1>
        <p className="text-muted-foreground">
          Discover the best places to visit and things to do in Macomb Township and surrounding areas.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <Searchbar 
          placeholder="Search attractions by name or location..." 
          filters={attractionFilters}
          type="attraction"
        />
      </div>
      
      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{attractions.length}</span> of{" "}
          <span className="font-medium text-foreground">{totalAttractions}</span> attractions
        </p>
      </div>
      
      {/* Featured attraction (if available and on first page) */}
      {currentPage === 1 && attractions.some(attraction => attraction.featured) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Badge variant="default" className="mr-2">Featured</Badge>
            Featured Attraction
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 bg-muted/30 rounded-lg p-4">
            {attractions
              .filter(attraction => attraction.featured)
              .slice(0, 1)
              .map(attraction => (
                <div key={attraction.id} className="col-span-1">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={attraction.image}
                      alt={attraction.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
              
            {attractions
              .filter(attraction => attraction.featured)
              .slice(0, 1)
              .map(attraction => (
                <div key={`desc-${attraction.id}`} className="col-span-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">{attraction.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Badge variant="secondary">{attraction.category}</Badge>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md">
                      <span className="text-sm font-medium">{attraction.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{attraction.address}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{attraction.description}</p>
                  <div className="mt-auto">
                    <Link href={`/attractions/${attraction.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Main Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Suspense fallback={<LoadingSpinner />}>
          {attractions
            .filter(attraction => !attraction.featured || currentPage !== 1)
            .map(attraction => (
              <Card 
                key={attraction.id} 
                {...attraction}
              />
            ))}
        </Suspense>
      </div>
      
      {/* Show message if no attractions found */}
      {attractions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No attractions found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
      
      {/* Pagination - Now using client component */}
      {totalPages > 1 && <ClientPaginationSection {...paginationParams} />}
    </div>
  );
}