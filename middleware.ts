
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Get the session token cookie
const sessionToken =
    req.cookies.get('__Secure-next-auth.session-token')?.value || 
    req.cookies.get('__Secure-next-auth.session-token.0')?.value || 
    req.cookies.get('__Secure-next-auth.session-token.1')?.value || 
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('next-auth.session-token.0')?.value ||
    req.cookies.get('next-auth.session-token.1')?.value;
  // If the session token is present, allow access to all routes in matcher
  if (sessionToken) {
    return NextResponse.next();
  }

  // If no session token, allow access only to the root route
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Redirect to the root path if trying to access any other route without the session token
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = { matcher: ["/home","/profile","/property","/settings","/welcome"] }