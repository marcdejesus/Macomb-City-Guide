'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { login, register, selectAuthLoading, selectAuthError, clearError } from '@/lib/redux/slices/authSlice';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  useEffect(() => {
    // Clear any existing errors when component mounts or tab changes
    dispatch(clearError());
  }, [dispatch, isLogin]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      try {
        await dispatch(login({
          email: formData.email,
          password: formData.password,
        })).unwrap();
        
        toast.success('Logged in successfully!');
        router.push('/profile');
      } catch (err) {
        // Error is handled by the reducer and displayed from the state
      }
    } else {
      try {
        await dispatch(register({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        })).unwrap();
        
        toast.success('Account created successfully! Please login.');
        setIsLogin(true);
      } catch (err) {
        // Error is handled by the reducer and displayed from the state
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Fill out the form below to create your account'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-start mb-4">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2" />
              <span>{typeof error === 'string' ? error : 'Authentication error'}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="register" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required={!isLogin}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required={!isLogin}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setIsLogin(false)}
                  type="button"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setIsLogin(true)}
                  type="button"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
}