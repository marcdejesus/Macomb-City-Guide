"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast.js";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "@/lib/redux/slices/favoritesSlice";

export default function AddToFavoritesButton({ id, type }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { items: favorites, isLoading } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Check if this item is already a favorite
  const isFavorite = favorites.some(
    (item) => item.id === id && item.type === type
  );
  
  const [isAdding, setIsAdding] = useState(false);
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      if (isFavorite) {
        dispatch(removeFavorite({ id, type }));
        toast({
          description: "Removed from favorites",
        });
      } else {
        dispatch(addFavorite({ id, type }));
        toast({
          description: "Added to favorites",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size="icon"
      disabled={isAdding || isLoading}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary-foreground" : ""}`} />
    </Button>
  );
}