import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function ContentSection({ 
  title, 
  description, 
  viewAllLink, 
  children,
  className = ""
}) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          
          {viewAllLink && (
            <Link href={viewAllLink} className="mt-2 md:mt-0">
              <Button variant="outline" className="group">
                View All 
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}