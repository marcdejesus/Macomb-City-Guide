"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ClientCarousel({ children }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {children}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

// Re-export the item component for convenience
export { CarouselItem } from "@/components/ui/carousel";