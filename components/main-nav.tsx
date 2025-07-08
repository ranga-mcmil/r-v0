// components/main-nav.tsx
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { USER_ROLES } from "@/lib/types"

interface NavItem {
  href: string
  label: string
}

function getNavItems(userRole: string): NavItem[] {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return [
        { href: "/", label: "Dashboard" },
        { href: "/branches", label: "Branches" },
        { href: "/users", label: "Users" },
        { href: "/customers", label: "Customers" },
        { href: "/products", label: "Products" },
        { href: "/categories", label: "Categories" },
        { href: "/batches", label: "Batches" },
        { href: "/inventory", label: "Inventory" },
        { href: "/orders", label: "Orders" },
        { href: "/referrals", label: "Referrals" },
      ]
    
    case USER_ROLES.MANAGER:
      return [
        { href: "/", label: "Dashboard" },
        { href: "/customers", label: "Customers" },
        { href: "/products", label: "Products" },
        { href: "/categories", label: "Categories" },
        { href: "/batches", label: "Batches" },
        { href: "/inventory", label: "Inventory" },
        { href: "/orders", label: "Orders" },
        { href: "/referrals", label: "Referrals" },
      ]
    
    case USER_ROLES.SALES_REP:
      return [
        { href: "/", label: "Dashboard" },
        { href: "/pos", label: "POS" },
        { href: "/customers", label: "Customers" },
        { href: "/products", label: "Products" },
        { href: "/orders", label: "Orders" },
        { href: "/referrals", label: "Referrals" },
      ]
    
    default:
      return []
  }
}

interface MainNavProps {
  pathname: string
}

export async function MainNav({ pathname }: MainNavProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.role) {
    return null
  }

  const navItems = getNavItems(session.user.role)

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium ${
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              ? "text-primary" 
              : "text-muted-foreground"
          } transition-colors hover:text-primary`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}