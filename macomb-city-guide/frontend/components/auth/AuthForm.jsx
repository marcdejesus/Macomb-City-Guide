'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { login, register, selectAuthLoading, selectAuthError, clearError } from '@/lib/redux/slices/authSlice';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function AuthForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(login({
      email: loginEmail,
      password: loginPassword
    }));
    
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful');
      router.push('/dashboard');
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const result = await dispatch(register({
      first_name: name.split(' ')[0],
      last_name: name.split(' ').slice(1).join(' '),
      email,
      username: email,
      password,
      password2: confirmPassword
    }));
    
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Registration successful! You can now log in.');
      setActiveTab('login');
    }
  };
  
  // Clear error when switching tabs
  const handleTabChange = (value) => {
    if (error) dispatch(clearError());
    setActiveTab(value);
  };

  return (
    <div className="mx-auto max-w-md">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            {/* Form fields */}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            {/* More form fields */}
            {/* ... */}
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}