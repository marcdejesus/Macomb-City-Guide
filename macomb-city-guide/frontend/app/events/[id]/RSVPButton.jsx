"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function RSVPButton({ eventId }) {
  const { toast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isRSVPd, setIsRSVPd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRSVP = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP for this event",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // await fetch('/api/events/rsvp', { 
      //   method: 'POST',
      //   body: JSON.stringify({ eventId }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // For demo, we're just toggling the state after a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsRSVPd(!isRSVPd);
      
      toast({
        title: isRSVPd ? "RSVP Cancelled" : "RSVP Confirmed",
        description: isRSVPd 
          ? "Your RSVP has been cancelled" 
          : "You're all set! We've added this event to your calendar.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <Button className="w-full" asChild>
          <a href="/auth/signin">Sign in to RSVP</a>
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Sign in or create an account to RSVP for this event
        </p>
      </div>
    );
  }
  
  return (
    <Button 
      onClick={handleRSVP}
      disabled={isLoading}
      className="w-full"
      variant={isRSVPd ? "outline" : "default"}
    >
      <Calendar className="mr-2 h-4 w-4" />
      {isLoading ? "Processing..." : (isRSVPd ? "Cancel RSVP" : "RSVP to this Event")}
    </Button>
  );
}