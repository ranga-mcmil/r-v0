import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // You can add additional logic here if needed
    // For example, role-based access control based on JWT data
    
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    
    // Example: Admin-only routes
    // if (pathname.startsWith('/admin') && token?.user?.role !== 'ADMIN') {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }
    
    // Example: Branch-specific access
    // if (pathname.startsWith('/branch') && !token?.user?.branchId) {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }
    
    // Allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If there's a token, the user is authenticated
        if (token) {
          return true;
        }
        
        // Check if the current path is a public route
        const { pathname } = req.nextUrl;
        const isPublicRoute = pathname === '/login' || pathname === '/forgot-password';
        
        // Allow access to public routes even without authentication
        if (isPublicRoute) {
          return true;
        }
        
        // Deny access to protected routes without authentication
        return false;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};