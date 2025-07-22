// app/(main)/orders/[id]/components/order-type-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FileText, ShoppingCart, CreditCard, Package } from "lucide-react"
import type { OrderType } from "@/lib/http-service/orders/types"

interface OrderTypeBadgeProps {
  orderType: OrderType
  className?: string
  showIcon?: boolean
}

export function OrderTypeBadge({ orderType, className, showIcon = true }: OrderTypeBadgeProps) {
  const getTypeConfig = (type: OrderType) => {
    switch (type) {
      case 'QUOTATION':
        return {
          label: 'Quotation',
          icon: FileText,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
        }
      case 'IMMEDIATE_SALE':
        return {
          label: 'Immediate Sale',
          icon: ShoppingCart,
          className: 'bg-green-100 text-green-800 hover:bg-green-100'
        }
      case 'LAYAWAY':
        return {
          label: 'Layaway',
          icon: CreditCard,
          className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
        }
      case 'FUTURE_COLLECTION':
        return {
          label: 'Future Collection',
          icon: Package,
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
        }
      default:
        return {
          label: type,
          icon: FileText,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
    }
  }

  const config = getTypeConfig(orderType)
  const Icon = config.icon

  return (
    <Badge 
      variant="secondary" 
      className={cn(config.className, className)}
    >
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}