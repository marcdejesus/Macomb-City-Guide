"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

export function Searchbar({ 
  placeholder = "Search...", 
  filters = [],
  type = "general", // can be: general, attraction, event, restaurant, property
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeFilters, setActiveFilters] = useState({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Initialize activeFilters from URL params
  useEffect(() => {
    const newFilters = {};
    filters.forEach(filter => {
      const value = searchParams.get(filter.key);
      if (value) {
        newFilters[filter.key] = value;
      }
    });
    setActiveFilters(newFilters);
  }, [searchParams, filters]);

  // Get number of active filters
  const activeFilterCount = Object.keys(activeFilters).length;

  // Create URL with search params
  const createQueryString = (params) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    // Handle params that need to be updated
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    return newSearchParams.toString();
  };

  // Handle search submission
  const handleSearch = (e) => {
    e?.preventDefault();
    
    const queryString = createQueryString({ q: searchQuery });
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
    
    // Create new URL without any filter params
    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set('q', searchQuery);
    }
    
    router.push(`${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`);
  };

  // Apply a single filter
  const applyFilter = (key, value) => {
    const newActiveFilters = { ...activeFilters };
    
    if (value === null || value === undefined || value === '') {
      delete newActiveFilters[key];
    } else {
      newActiveFilters[key] = value;
    }
    
    setActiveFilters(newActiveFilters);
    
    // Update URL
    const queryString = createQueryString({ ...newActiveFilters, q: searchQuery });
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  // Get filters appropriate for the page type
  const getPageFilters = () => {
    if (filters && filters.length > 0) {
      return filters;
    }

    // Default filters by page type if none provided
    switch (type) {
      case 'attraction':
        return [
          { key: 'category', label: 'Category', type: 'select', options: [
            { value: 'museum', label: 'Museums' },
            { value: 'park', label: 'Parks' },
            { value: 'historic', label: 'Historic Sites' },
            { value: 'entertainment', label: 'Entertainment' }
          ] },
          { key: 'city', label: 'City', type: 'select', options: [
            { value: 'macomb', label: 'Macomb' }
          ] },
          { key: 'featured', label: 'Featured', type: 'checkbox' }
        ];
      case 'event':
        return [
          { key: 'event_type', label: 'Event Type', type: 'select', options: [
            { value: 'festival', label: 'Festivals' },
            { value: 'concert', label: 'Concerts' },
            { value: 'sports', label: 'Sports' },
            { value: 'community', label: 'Community' }
          ] },
          { key: 'upcoming', label: 'Upcoming Only', type: 'checkbox' },
          { key: 'featured', label: 'Featured', type: 'checkbox' }
        ];
      case 'restaurant':
        return [
          { key: 'cuisine', label: 'Cuisine', type: 'select', options: [
            { value: 'american', label: 'American' },
            { value: 'italian', label: 'Italian' },
            { value: 'mexican', label: 'Mexican' },
            { value: 'asian', label: 'Asian' }
          ] },
          { key: 'featured', label: 'Featured', type: 'checkbox' }
        ];
      case 'property':
        return [
          { key: 'property_type', label: 'Property Type', type: 'select', options: [
            { value: 'house', label: 'Houses' },
            { value: 'apartment', label: 'Apartments' },
            { value: 'commercial', label: 'Commercial' }
          ] },
          { key: 'for_sale', label: 'For Sale', type: 'checkbox' },
          { key: 'min_price', label: 'Min Price', type: 'number' },
          { key: 'max_price', label: 'Max Price', type: 'number' },
          { key: 'bedrooms', label: 'Min Bedrooms', type: 'number' }
        ];
      default:
        return [];
    }
  };

  const pageFilters = getPageFilters();

  // Render filter controls based on type
  const renderFilterControl = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={activeFilters[filter.key] || ''}
            onValueChange={(value) => applyFilter(filter.key, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}s</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${filter.key}`}
              checked={activeFilters[filter.key] === 'true'}
              onCheckedChange={(checked) => 
                applyFilter(filter.key, checked ? 'true' : null)
              }
            />
            <label
              htmlFor={`filter-${filter.key}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {filter.label}
            </label>
          </div>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={filter.label}
            value={activeFilters[filter.key] || ''}
            onChange={(e) => applyFilter(filter.key, e.target.value)}
          />
        );
        
      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>${filter.min}</span>
              <span>${filter.max}</span>
            </div>
            <Slider
              defaultValue={[filter.min, filter.max]}
              min={filter.min}
              max={filter.max}
              step={1000}
              onValueChange={(values) => {
                applyFilter(`min_${filter.key}`, values[0]);
                applyFilter(`max_${filter.key}`, values[1]);
              }}
            />
            <div className="flex justify-between">
              <span className="text-xs">Min: ${activeFilters[`min_${filter.key}`] || filter.min}</span>
              <span className="text-xs">Max: ${activeFilters[`max_${filter.key}`] || filter.max}</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => {
                setSearchQuery('');
                if (searchParams.has('q')) {
                  const queryString = createQueryString({ q: null });
                  router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
                }
              }}
              className="absolute right-2.5 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
        
        {pageFilters.length > 0 && (
          <>
            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  className="relative md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your search results.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  {pageFilters.map((filter) => (
                    <div key={filter.key} className="space-y-2">
                      <label className="text-sm font-medium">
                        {filter.label}
                      </label>
                      {renderFilterControl(filter)}
                    </div>
                  ))}
                </div>
                <SheetFooter>
                  <div className="flex justify-between w-full">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                    <SheetClose asChild>
                      <Button>Apply Filters</Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {/* Desktop filter button with popover */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  type="button"
                  variant="outline"
                  className="relative hidden md:flex"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Filter Results</h4>
                  <Separator />
                  {pageFilters.map((filter) => (
                    <div key={filter.key} className="space-y-2">
                      <label className="text-sm font-medium">
                        {filter.label}
                      </label>
                      {renderFilterControl(filter)}
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
        
        <Button type="submit">
          Search
        </Button>
      </form>
      
      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = pageFilters.find(f => f.key === key);
            if (!filter) return null;
            
            let displayValue = value;
            if (filter.type === 'select') {
              const option = filter.options.find(opt => opt.value === value);
              if (option) displayValue = option.label;
            } else if (filter.type === 'checkbox') {
              displayValue = filter.label;
            }
            
            return (
              <Badge 
                key={key} 
                variant="secondary"
                className="pl-2 flex items-center gap-1"
              >
                {filter.label}: {displayValue}
                <button 
                  onClick={() => applyFilter(key, null)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {filter.label} filter</span>
                </button>
              </Badge>
            );
          })}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

export default Searchbar;