"use client";

import { useRouter } from 'next/navigation';
import { ListFilter, DollarSign, ChevronDown, Grid, Rows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Searchbar } from "@/components/Searchbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FilterBar({ searchParams, cuisines, selectedCuisine, selectedPrice, selectedSort, displayMode }) {
  const router = useRouter();

  const updateSearchParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`/restaurants?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/restaurants');
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
        {/* Search */}
        <div className="w-full max-w-md">
          <Searchbar 
            placeholder="Search restaurants..." 
            type="restaurant"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Cuisine Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                <ListFilter className="h-4 w-4" />
                Cuisine
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup value={selectedCuisine}>
                <DropdownMenuRadioItem 
                  value="" 
                  onClick={() => updateSearchParams("cuisine", null)}
                >
                  All Cuisines
                </DropdownMenuRadioItem>
                <Separator className="my-1" />
                {cuisines.map((cuisine) => (
                  <DropdownMenuRadioItem 
                    key={cuisine.id} 
                    value={cuisine.name.toLowerCase()}
                    onClick={() => updateSearchParams("cuisine", cuisine.name.toLowerCase())}
                  >
                    {cuisine.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Price Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                <DollarSign className="h-4 w-4" />
                Price
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={selectedPrice}>
                <DropdownMenuRadioItem 
                  value="" 
                  onClick={() => updateSearchParams("price", null)}
                >
                  Any Price
                </DropdownMenuRadioItem>
                <Separator className="my-1" />
                <DropdownMenuRadioItem 
                  value="$"
                  onClick={() => updateSearchParams("price", "$")}
                >
                  $ (Inexpensive)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem 
                  value="$$"
                  onClick={() => updateSearchParams("price", "$$")}
                >
                  $$ (Moderate)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem 
                  value="$$$"
                  onClick={() => updateSearchParams("price", "$$$")}
                >
                  $$$ (Expensive)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={selectedSort}>
                <DropdownMenuRadioItem 
                  value="rating-desc"
                  onClick={() => updateSearchParams("sort", "rating-desc")}
                >
                  Highest Rated
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem 
                  value="rating-asc"
                  onClick={() => updateSearchParams("sort", "rating-asc")}
                >
                  Lowest Rated
                </DropdownMenuRadioItem>
                <Separator className="my-1" />
                <DropdownMenuRadioItem 
                  value="name-asc"
                  onClick={() => updateSearchParams("sort", "name-asc")}
                >
                  Name (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem 
                  value="name-desc"
                  onClick={() => updateSearchParams("sort", "name-desc")}
                >
                  Name (Z-A)
                </DropdownMenuRadioItem>
                <Separator className="my-1" />
                <DropdownMenuRadioItem 
                  value="price-asc"
                  onClick={() => updateSearchParams("sort", "price-asc")}
                >
                  Price (Low to High)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem 
                  value="price-desc"
                  onClick={() => updateSearchParams("sort", "price-desc")}
                >
                  Price (High to Low)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* View Toggle */}
          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant={displayMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => updateSearchParams("display", "grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={displayMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => updateSearchParams("display", "list")}
            >
              <Rows className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Active filters */}
      {(selectedCuisine || selectedPrice) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCuisine && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Cuisine: {selectedCuisine}
              <button
                className="ml-1"
                onClick={() => updateSearchParams("cuisine", null)}
              >
                ×
              </button>
            </Badge>
          )}
          {selectedPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: {selectedPrice}
              <button
                className="ml-1"
                onClick={() => updateSearchParams("price", null)}
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}