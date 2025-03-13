'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import apiClient from '@/lib/api';

export default function APIStatusCheck() {
  const [status, setStatus] = useState('unknown');
  const [error, setError] = useState(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      // Using the test connection method
      await apiClient.testConnection();
      setStatus('connected');
    } catch (err) {
      console.error('API connection error:', err);
      setStatus('error');
      setError(err.message || 'Connection failed');
    }
  };

  return (
    <Card className="mt-6 mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Backend API Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {status === 'connected' ? (
            <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
          ) : status === 'error' ? (
            <XCircle className="text-red-500 h-5 w-5 mr-2" />
          ) : (
            <div className="h-5 w-5 mr-2 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          )}
          <span>
            {status === 'connected' ? 'Connected to API' : 
             status === 'error' ? 'Connection Failed' : 
             status === 'checking' ? 'Checking connection...' : 'Check API Connection'}
          </span>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={checkApiStatus} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Check Connection
        </Button>
      </CardFooter>
    </Card>
  );
}