"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse the date range from URL parameters
  const initialStartDate = searchParams.get("startDate") 
    ? new Date(searchParams.get("startDate")) 
    : undefined;
    
  const initialEndDate = searchParams.get("endDate") 
    ? new Date(searchParams.get("endDate")) 
    : undefined;
  
  // Set up date state
  const [date, setDate] = React.useState({
    from: initialStartDate,
    to: initialEndDate,
  });

  // Function to update the URL with the selected date range
  function handleDateSelect(selectedRange) {
    setDate(selectedRange);
    
    // Create a new URLSearchParams object based on current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove date parameters
    if (selectedRange?.from) {
      params.set("startDate", format(selectedRange.from, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
    }
    
    if (selectedRange?.to) {
      params.set("endDate", format(selectedRange.to, "yyyy-MM-dd"));
    } else {
      params.delete("endDate");
    }
    
    // Generate the new URL and navigate
    router.push(`/events?${params.toString()}`);
  }
  
  // Function to clear date selection
  function handleClearDates() {
    setDate({ from: undefined, to: undefined });
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("startDate");
    params.delete("endDate");
    
    router.push(`/events?${params.toString()}`);
  }

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearDates} 
              className="ml-auto flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear dates
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}