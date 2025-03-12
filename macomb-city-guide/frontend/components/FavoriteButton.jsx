'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleFavorite, selectIsFavorite } from '@/lib/redux/slices/favoritesSlice';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function FavoriteButton({ itemType, itemId }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFavorite = useAppSelector(selectIsFavorite(itemType, itemId));
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(toggleFavorite({ itemType, itemId })).unwrap();
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`rounded-full ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
    </Button>
  );
}