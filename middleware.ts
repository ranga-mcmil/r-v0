// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Define your user roles
const USER_ROLES = {
  SALES_REP: 'ROLE_SALES_REP',
  MANAGER: 'ROLE_MANAGER',
  ADMIN: 'ROLE_ADMIN'
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Define role-based access control rules
const accessRules = {
  // Admin can access everything - no restrictions
  [USER_ROLES.ADMIN]: {
    allowedPaths: ["*"], // Wildcard means all paths
    restrictedPaths: []
  },
  
  // Manager access rules
  [USER_ROLES.MANAGER]: {
    allowedPaths: [
      "/", // Dashboard
      "/dashboard",
      "/profile",
      "/branches", // Can view branches (filtered to own)
      "/customers",
      "/products",
      "/products/*",
      "/categories", // Read-only
      "/colors", // Read-only
      "/customers/1",
      "/customers/*",
      "/thicknesses", // Read-only
      "/measurement-units", // Read-only
      "/measurement-units/new",
      "/inventory/*",
      "/inventory",
      "/inventory/add",
      "/inventory/adjust",
      "/inventory/history/*",
      "/inventory/products/*/add",
      "/inventory/products/*/history",
      "/inventory/products/*/adjustments/remove",
      "/inventory/products/*/adjustments/correct",
      "/inventory/batches/*/history",
      "/inventory/batches/*/add",
      "/batches",
      "/batches/*",
      "/orders",
      "/orders/*",
      "/pos",
      "/quotations",
      "/layaway",
      "/production",
      "/production/create",
      "/productions/batches/*",
      "/categories/create",
      "/productions/new",
      "/stock-movements",
      "/measurement-units/create",
      "/thicknesses/*",
      "/colors/*",
      "/measurement-units/*",
      "/users", // Can manage branch users
      "/settings", // Branch settings only
      "/reports",
      "/referrals",
      "/referral-payments",
      "/referrals/new",
      "/referrals/*/delete",
      "/referrals/*/edit",
      "/referrals/*",
      "/unauthorized",
      "/terms",
      "/privacy",
      "/contact",
      "/reports/inventory",
      "/reports/sales-summary",
      "/reports/sales-detail"
    ],
    restrictedPaths: [
      "/branches/*/edit", // Cannot edit branches
      "/branches/*/activate",
      "/branches/*/deactivate",
      "/categories/*/edit", // Cannot edit master data
      "/colors/*/edit",
      "/thicknesses/*/edit",
      "/measurement-units/*/edit",
      "/pos",
      

    ]
  },
  
  // Sales Rep access rules
  [USER_ROLES.SALES_REP]: {
    allowedPaths: [
      "/", // Dashboard
      "/dashboard",
      "/profile",
      "/customers",
      "/products",
      "/categories", // Read-only
      "/colors", // Read-only
      "/thicknesses", // Read-only
      "/measurement-units", // Read-only
      "/inventory",
      "/batches",
      "/orders",
      "/orders/*",
      "/pos",
      "/quotations",
      "/layaway",
      "/productions",
      "/stock-movements",
      "/reports",
      "/unauthorized",
      "/terms",
      "/privacy",
      "/contact",
      "/referrals",
      "/referrals/create"
    ],
    restrictedPaths: [
      "/users", // Cannot access user management
      "/users/*",
      "/settings", // Cannot access settings
      "/branches", // Read-only view of own branch
      "/branches/*/edit",
      "/branches/*/activate",
      "/branches/*/deactivate",
      "/categories/*/edit",
      "/colors/*/edit",
      "/thicknesses/*/edit",
      "/measurement-units/*/edit",
      "/products/*/delete", // Cannot delete products
      "/batches/*/delete" // Cannot delete batches
    ]
  }
};

// Helper function to check if a path matches a pattern
function pathMatches(path: string, pattern: string): boolean {
  if (pattern === "*") return true;
  if (pattern === path) return true;
  
  // Handle wildcard patterns like "/users/*"
  if (pattern.includes("*")) {
    const regexPattern = pattern.replace(/\*/g, ".*");
    return new RegExp(`^${regexPattern}$`).test(path);
  }
  
  // Handle dynamic routes like "/branches/[id]/edit"
  if (pattern.includes("[") && pattern.includes("]")) {
    const regexPattern = pattern.replace(/\[.*?\]/g, "[^/]+");
    return new RegExp(`^${regexPattern}$`).test(path);
  }
  
  return false;
}

// Helper function to check if user has access to a path
function hasAccess(userRole: UserRole, pathname: string): boolean {
  const rules = accessRules[userRole];
  if (!rules) return false;
  
  // Check if path is explicitly restricted
  for (const restrictedPath of rules.restrictedPaths) {
    if (pathMatches(pathname, restrictedPath)) {
      return false;
    }
  }
  
  // Check if path is allowed
  for (const allowedPath of rules.allowedPaths) {
    if (pathMatches(pathname, allowedPath)) {
      return true;
    }
  }
  
  return false;
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Get user role from token
    const userRole = req.nextauth.token?.user?.role as UserRole;
    
    // Check if user has access to the requested path
    if (userRole && !hasAccess(userRole, pathname)) {
      console.log(`Access denied for role ${userRole} to path ${pathname}`);
      
      // Redirect to unauthorized page
      const unauthorizedUrl = new URL('/unauthorized', req.url);
      unauthorizedUrl.searchParams.set("attempted", pathname);
      
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Add pathname and user info to headers so server components can access it
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', pathname);
    
    if (userRole) {
      requestHeaders.set("x-user-role", userRole);
    }
    
    if (req.nextauth.token?.user?.branchId) {
      requestHeaders.set("x-user-branch", req.nextauth.token.user.branchId);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /login (your public login page)
     * - /unauthorized (unauthorized page)
     * - /api/auth (NextAuth API routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - Static assets (images, fonts, etc.)
     */
    "/((?!login|unauthorized|api|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$).*)"
  ],
};