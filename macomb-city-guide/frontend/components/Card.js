import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  ExternalLink, 
  DollarSign,
  Phone
} from "lucide-react";

import { 
  Card as ShadcnCard, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Card({
  id,
  type,
  title,
  description,
  image,
  category,
  address,
  date,
  time,
  price,
  rating,
  phone,
  featured = false,
  className,
  ...props
}) {
  // Define type-specific URLs
  const urls = {
    attraction: `/attractions/${id}`,
    event: `/events/${id}`,
    restaurant: `/dining/${id}`,
    property: `/real-estate/${id}`,
    transport: `/transportation/${id}`
  };

  // Format price if available (can be a number or a string like "$$$")
  const formatPrice = (price) => {
    if (!price) return null;
    
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    
    return price;
  };

  // Format date if available
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ShadcnCard className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`} {...props}>
      <div className="relative">
        {/* Image */}
        <div className="relative h-48 w-full">
          {image ? (
            <Image 
              src={image} 
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-muted h-48 w-full flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        
        {/* Featured badge */}
        {featured && (
          <Badge 
            variant="default" 
            className="absolute top-2 right-2 bg-primary/90 hover:bg-primary"
          >
            Featured
          </Badge>
        )}
        
        {/* Category badge */}
        {category && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 left-2"
          >
            {category}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          {rating && (
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
        {/* Location */}
        {address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{address}</span>
          </div>
        )}
        
        {/* Date & Time (for events) */}
        {date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(date)}</span>
            {time && (
              <>
                <Clock className="h-4 w-4 shrink-0 ml-2" />
                <span>{time}</span>
              </>
            )}
          </div>
        )}
        
        {/* Price */}
        {price && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span>{formatPrice(price)}</span>
          </div>
        )}
        
        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link href={urls[type] || '#'} className="w-full">
          <Button variant="default" className="w-full gap-2">
            <span>View Details</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </ShadcnCard>
  );
}

// Simplified alternative version that takes fewer props and renders a simpler card
export function SimpleCard({ 
  id, 
  type, 
  title, 
  image, 
  category,
  description 
}) {
  const urls = {
    attraction: `/attractions/${id}`,
    event: `/events/${id}`,
    restaurant: `/dining/${id}`,
    property: `/real-estate/${id}`,
    transport: `/transportation/${id}`
  };

  return (
    <Link href={urls[type] || '#'} className="group">
      <ShadcnCard className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="relative h-40">
          {image ? (
            <Image 
              src={image} 
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-muted h-40 w-full flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {category && (
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 left-2"
            >
              {category}
            </Badge>
          )}
        </div>
        
        <CardHeader className="py-3">
          <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-2 text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      </ShadcnCard>
    </Link>
  );
}

export default Card;