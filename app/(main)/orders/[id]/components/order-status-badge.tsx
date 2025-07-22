// app/(main)/orders/[id]/components/order-status-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/http-service/orders/types"

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        }
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
        }
      case 'PARTIALLY_PAID':
        return {
          label: 'Partially Paid',
          className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
        }
      case 'FULLY_PAID':
        return {
          label: 'Fully Paid',
          className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
        }
      case 'READY_FOR_COLLECTION':
        return {
          label: 'Ready for Collection',
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
        }
      case 'COMPLETED':
        return {
          label: 'Completed',
          className: 'bg-green-100 text-green-800 hover:bg-green-100'
        }
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 hover:bg-red-100'
        }
      case 'REVERSED':
        return {
          label: 'Reversed',
          className: 'bg-red-100 text-red-800 hover:bg-red-100'
        }
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge 
      variant="secondary" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}