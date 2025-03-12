"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "@/lib/redux/slices/favoritesSlice";

export default function AddToFavoritesButton({ itemId, itemType, title, image }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.items);
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Check if item is already in favorites
  useEffect(() => {
    if (favorites && itemId) {
      const found = favorites.find(
        (item) => item.id === itemId && item.type === itemType
      );
      setIsFavorite(!!found);
    }
  }, [favorites, itemId, itemType]);
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }
    
    const favoriteItem = { id: itemId, type: itemType, title, image };
    
    if (isFavorite) {
      dispatch(removeFavorite({ id: itemId, type: itemType }));
      toast({
        title: "Removed from favorites",
        description: `${title} has been removed from your favorites`,
      });
    } else {
      dispatch(addFavorite(favoriteItem));
      toast({
        title: "Added to favorites",
        description: `${title} has been added to your favorites`,
      });
    }
  };
  
  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      className="w-full"
      onClick={handleToggleFavorite}
    >
      <Heart
        className={`mr-2 h-4 w-4 ${isFavorite ? "fill-white" : ""}`}
      />
      {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
    </Button>
  );
}