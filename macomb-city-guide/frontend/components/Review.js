'use client';

import { useState } from 'react';
import { Star, StarHalf, ThumbsUp, Flag } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

// For displaying a single review
export function ReviewItem({ 
  author, 
  date, 
  rating, 
  content,
  avatar,
  helpful = 0
}) {
  const [helpfulCount, setHelpfulCount] = useState(helpful);
  const [hasVoted, setHasVoted] = useState(false);
  
  const handleHelpfulClick = () => {
    if (!hasVoted) {
      setHelpfulCount(helpfulCount + 1);
      setHasVoted(true);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback>{author?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{author}</h4>
            <div className="flex items-center gap-2">
              <ReviewStars rating={rating} />
              <span className="text-xs text-muted-foreground">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm">{content}</p>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 h-7"
          onClick={handleHelpfulClick}
          disabled={hasVoted}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful ({helpfulCount})
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 h-7"
        >
          <Flag className="h-3.5 w-3.5" />
          Report
        </Button>
      </div>
    </div>
  );
}

// For writing a review
export function ReviewForm({ onSubmit }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    onSubmit?.({ rating, content: review });
    setReview('');
    setRating(0);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium">Write a Review</h3>
      
      <div className="space-y-2">
        <label htmlFor="rating" className="text-sm">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-gray-300 hover:text-yellow-400"
            >
              <Star 
                className={`h-6 w-6 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="review" className="text-sm">Your review</label>
        <Textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
        />
      </div>
      
      <Button type="submit" disabled={rating === 0}>
        Submit Review
      </Button>
    </form>
  );
}

// Star ratings display
export function ReviewStars({ rating, maxRating = 5, className = "" }) {
  const numericRating = Math.min(Math.max(0, Number(rating) || 0), maxRating);
  
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={`flex ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
}

// Reviews list component
export function ReviewsList({ reviews = [], showForm = false }) {
  const handleSubmitReview = (reviewData) => {
    // This would call an API endpoint to submit the review
    console.log("Submitting review:", reviewData);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
      
      {showForm && (
        <>
          <ReviewForm onSubmit={handleSubmitReview} />
          <Separator className="my-6" />
        </>
      )}
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={review.id || index}>
              <ReviewItem {...review} />
              {index < reviews.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
      )}
    </div>
  );
}