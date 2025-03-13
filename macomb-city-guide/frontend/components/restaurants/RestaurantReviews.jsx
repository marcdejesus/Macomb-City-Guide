'use client';

import { useState, useEffect } from 'react';
import { getReviews } from '@/lib/api';
import ReviewCard from './ReviewCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function RestaurantReviews({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const response = await getReviews({ 
          content_type: 'restaurant', 
          object_id: restaurantId 
        });
        setReviews(response.results);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [restaurantId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))
      ) : (
        <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
      )}
    </div>
  );
}