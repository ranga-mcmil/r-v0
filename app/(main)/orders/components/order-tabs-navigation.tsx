// app/(main)/orders/components/order-tabs-navigation.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, ShoppingCart, CreditCard, Package, BarChart3 } from "lucide-react"

interface OrderTabsNavigationProps {
  currentTab: string
}

const orderTabs = [
  {
    id: 'all',
    label: 'All Orders',
    icon: ShoppingCart,
    description: 'View all orders'
  },
  {
    id: 'quotations', 
    label: 'Quotations',
    icon: FileText,
    description: 'Pending quotations'
  },
  {
    id: 'layaway',
    label: 'Layaway',
    icon: CreditCard,
    description: 'Payment plans'
  },
  {
    id: 'ready',
    label: 'Ready for Collection',
    icon: Package,
    description: 'Ready to collect'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    description: 'Order reports'
  }
]

export function OrderTabsNavigation({ currentTab }: OrderTabsNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams)
    
    // Update tab parameter
    params.set('tab', tabId)
    
    // Reset pagination when switching tabs
    params.delete('page')
    
    // Keep other filters but clear tab-specific ones when switching
    if (tabId !== currentTab) {
      // Reset filters that might not apply to new tab
      params.delete('orderType')
      params.delete('status')
    }
    
    router.push(`/orders?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
          {orderTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {/* You can add count badges here if needed */}
                {tab.id === 'quotations' && (
                  <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
                    3
                  </Badge>
                )}
                {tab.id === 'ready' && (
                  <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
                    2
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}