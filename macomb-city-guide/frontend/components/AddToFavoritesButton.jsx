'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleFavorite, selectIsFavorite } from '@/lib/redux/slices/favoritesSlice';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AddToFavoritesButton({ itemId, itemType, title, image }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, itemType, itemId));
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await dispatch(toggleFavorite({ 
        itemType, 
        itemId,
        title,
        image 
      })).unwrap();
      
      toast.success(
        isFavorite 
          ? `${title} removed from favorites` 
          : `${title} added to favorites`
      );
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleToggleFavorite}
      variant={isFavorite ? "default" : "outline"}
      size="sm"
      className="gap-2"
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
      {isFavorite ? 'Saved' : 'Save'}
    </Button>
  );
}