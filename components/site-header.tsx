// components/site-header.tsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Menu, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { headers } from "next/headers"
import { MainNav } from "@/components/main-nav"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { UserRole, USER_ROLES } from "@/lib/types"
import { LogoutButton } from "@/components/logout-button"
import { MobileNav } from "./mobile-nav"

// Helper function to get user initials
function getUserInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  if (email) {
    const emailParts = email.split('@')[0].split('.')
    if (emailParts.length >= 2) {
      return `${emailParts[0].charAt(0)}${emailParts[1].charAt(0)}`.toUpperCase()
    }
    return email.charAt(0).toUpperCase()
  }
  return "U"
}

// Helper function to format role display
function formatRole(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "Admin"
    case USER_ROLES.MANAGER:
      return "Manager"
    case USER_ROLES.SALES_REP:
      return "Sales Rep"
    default:
      return "User"
  }
}

// Helper function to get role color
function getRoleColor(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case USER_ROLES.MANAGER:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case USER_ROLES.SALES_REP:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export async function SiteHeader() {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'
  const session = await getServerSession(authOptions)

  // Get user display info
  const userName = session?.user?.email || "Unknown User"
  const userInitials = getUserInitials(undefined, undefined, session?.user?.email)
  const userRole = session?.user?.role
  const formattedRole = userRole ? formatRole(userRole) : "User"
  const roleColorClass = userRole ? getRoleColor(userRole) : getRoleColor(USER_ROLES.SALES_REP)

  // Determine which icons to show on desktop
  const shouldShowOrdersIcon = userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.SALES_REP || userRole === USER_ROLES.ADMIN

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-6 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center space-x-2" aria-label="RoofStar">
                  <div className="relative h-8 w-8 overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="RoofStar Industries Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold">RoofStar</span>
                </Link>
              </div>
              
              {/* Mobile User Info */}
              {session && (
                <div className="mx-2 my-4 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {userName}
                      </p>
                      <Badge variant="secondary" className={`text-xs ${roleColorClass}`}>
                        {formattedRole}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <MobileNav pathname={pathname} userRole={userRole} />
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="hidden md:block">
            <div className="relative h-10 w-40">
              <Image
                src="/logo.png"
                alt="RoofStar Industries Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          
          <div className="hidden md:ml-6 md:block">
            <MainNav pathname={pathname} />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <nav className="flex items-center space-x-1">
            {/* Conditionally render Orders icon for Manager and Sales Rep */}
            {shouldShowOrdersIcon && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/orders">
                  <FileText className="h-5 w-5" />
                  <span className="sr-only">Orders</span>
                </Link>
              </Button>
            )}

            {/* User Dropdown */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto rounded-full px-2 py-1">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant="secondary" className={`text-xs ${roleColorClass} hidden sm:inline-flex`}>
                        {formattedRole}
                      </Badge>
                    </div>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}