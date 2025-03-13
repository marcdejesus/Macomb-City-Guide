import { Suspense } from "react";
import { getRestaurants, getCuisines } from "@/lib/api";
import RestaurantList from "@/components/restaurants/RestaurantList";
import FilterBar from "@/components/restaurants/FilterBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function RestaurantsPage({ searchParams }) {
  // Server-side data fetching
  const restaurantsData = await getRestaurants(searchParams);
  const cuisines = await getCuisines();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants in Macomb</h1>
      
      <FilterBar 
        searchParams={searchParams} 
        cuisines={cuisines.results || []} 
        selectedCuisine={searchParams?.cuisine || ""} 
        selectedPrice={searchParams?.price || ""} 
        selectedSort={searchParams?.sort || "rating-desc"} 
        displayMode={searchParams?.view || "grid"}
      />
      
      <Suspense fallback={<LoadingSpinner />}>
        <RestaurantList 
          restaurants={restaurantsData.results} 
          totalRestaurants={restaurantsData.count} 
          totalPages={Math.ceil(restaurantsData.count / (searchParams?.limit || 12))}
          currentPage={Number(searchParams?.page || 1)}
        />
      </Suspense>
    </div>
  );
}