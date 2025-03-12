'use client';

import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorDisplay({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {reset && (
        <Button onClick={reset} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}

export function withErrorBoundary(Component) {
  return function WithErrorBoundary(props) {
    const [error, setError] = useState(null);
    
    if (error) {
      return <ErrorDisplay error={error} reset={() => setError(null)} />;
    }
    
    try {
      return <Component {...props} />;
    } catch (err) {
      setError(err);
      return <ErrorDisplay error={err} reset={() => setError(null)} />;
    }
  };
}