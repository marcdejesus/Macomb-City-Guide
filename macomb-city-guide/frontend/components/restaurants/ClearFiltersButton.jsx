"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function ClearFiltersButton() {
  const router = useRouter();
  
  return (
    <Button 
      variant="outline" 
      onClick={() => router.push("/restaurants")}
      className="mt-4"
    >
      Clear All Filters
    </Button>
  );
}