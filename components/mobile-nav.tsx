// components/mobile-nav.tsx
import Link from "next/link"
import { USER_ROLES } from "@/lib/types"

interface NavItem {
  href: string
  label: string
}

function getMobileNavItems(userRole: string): NavItem[] {
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
        { href: "/reports", label: "Reports" }
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
        { href: "/reports", label: "Reports" }
      ]
    
    case USER_ROLES.SALES_REP:
      return [
        { href: "/", label: "Dashboard" },
        { href: "/customers", label: "Customers" },
        { href: "/pos", label: "POS" },
        { href: "/products", label: "Products" },
        { href: "/orders", label: "Orders" },
        { href: "/referrals", label: "Referrals" },
        { href: "/reports", label: "Reports" }
      ]
    
    default:
      return []
  }
}

interface MobileNavProps {
  pathname: string
  userRole?: string
}

export function MobileNav({ pathname, userRole }: MobileNavProps) {
  if (!userRole) return null

  const navItems = getMobileNavItems(userRole)

  return (
    <nav className="flex flex-col gap-4 px-2 py-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}