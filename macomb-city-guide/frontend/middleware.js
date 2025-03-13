import { NextResponse } from 'next/server';
 
export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  
  // Check if user is trying to access protected routes without a token
  if (!token && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/favorites')
  )) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Check if user is trying to access auth pages with a valid token
  if (token && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}
 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/favorites/:path*',
    '/login',
    '/register',
  ],
};