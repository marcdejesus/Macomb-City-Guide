"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { CarouselItem } from "@/components/ui/carousel";
import { SimpleCard } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Dynamically import the Carousel component on the client side
const DynamicCarousel = dynamic(() => import('./ClientCarousel'), { 
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function ClientCarouselSection({ items }) {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Discover More of Macomb</h2>
          <Link href="/attractions" className="text-primary mt-2 md:mt-0">View All</Link>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicCarousel>
            {items.map((item) => (
              <CarouselItem key={`${item.type}-${item.id}`} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <SimpleCard 
                    id={item.id}
                    type={item.type}
                    title={item.title}
                    image={item.image}
                    category={item.category}
                    description={item.description}
                  />
                </div>
              </CarouselItem>
            ))}
          </DynamicCarousel>
        </Suspense>
      </div>
    </section>
  );
}