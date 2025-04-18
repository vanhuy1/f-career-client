import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLES } from './enums/roles.enum';

// Define which paths should be protected
// const PROTECTED_COMPANY_PATHS = [
//     '/co', // Company dashboard
//     '/co/applicant-list',
//     '/co/job-list',
//     '/co/messages',
//     '/co/profile',
//     '/co/schedule',
//     '/co/settings'
// ];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected company path
  if (pathname.startsWith('/co')) {
    // Get the session token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      // Validate the token (simple check here - you might need to call a validation API)
      // For a more secure implementation, you would verify the token with your backend
      const userRole = getUserRoleFromToken(token);

      if (userRole !== ROLES.RECRUITER) {
        // User is not a recruiter, so redirect to unauthorized or homepage
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Token validation failed
      console.error('Token validation error:', error);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Continue the request for non-protected paths or authenticated recruiters
  return NextResponse.next();
}

// Helper function to extract user role from token
// In a real implementation, you would decode the JWT or validate with your backend
function getUserRoleFromToken(token: string): string {
  try {
    // This is a placeholder. In a real app, you would:
    // 1. Decode the JWT token
    // 2. Extract the role from the payload

    // For demonstration purposes, assuming token structure allows role extraction
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );
    return payload.role;
  } catch (error) {
    // If token parsing fails, return an empty role
    console.error('Error parsing token:', error);
    return '';
  }
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    // '/co/:path*',
  ],
};
