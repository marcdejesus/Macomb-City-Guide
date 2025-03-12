"use client";

import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  // Format date to "X days/months ago"
  const formattedDate = formatDistanceToNow(
    new Date(review.date),
    { addSuffix: true }
  );
  
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold">{review.author}</h4>
          <div className="text-xs text-muted-foreground">{formattedDate}</div>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{review.rating}</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  );
}