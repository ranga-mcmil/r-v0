// app/(main)/orders/[id]/components/order-actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CreditCard, 
  CheckCircle, 
  RotateCcw, 
  Package,
  AlertTriangle 
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { markReadyForCollectionAction, completeCollectionAction } from "@/actions/orders"
import type { OrderResponseDTO } from "@/lib/http-service/orders/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrderActionsProps {
  order: OrderResponseDTO
}

export function OrderActions({ order }: OrderActionsProps) {
  const { toast } = useToast()
  const [isMarkingReady, setIsMarkingReady] = useState(false)
  const [isCompletingCollection, setIsCompletingCollection] = useState(false)

  const handleMarkReady = async () => {
    setIsMarkingReady(true)
    try {
      const result = await markReadyForCollectionAction(order.id)
      if (result.success) {
        toast({
          title: "Order marked as ready",
          description: "Order has been marked as ready for collection",
        })
        // Refresh the page or redirect
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark order as ready",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsMarkingReady(false)
    }
  }

  const handleCompleteCollection = async () => {
    setIsCompletingCollection(true)
    try {
      const result = await completeCollectionAction(order.id)
      if (result.success) {
        toast({
          title: "Collection completed",
          description: "Order collection has been completed successfully",
        })
        // Refresh the page or redirect
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to complete collection",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCompletingCollection(false)
    }
  }

  // Determine primary action based on order type and status
  const getPrimaryAction = () => {
    // Convert quotation to order
    if (order.orderType === 'QUOTATION' && order.status === 'PENDING') {
      return (
        <Button asChild>
          <Link href={`/orders/${order.id}/convert`}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Convert to Order
          </Link>
        </Button>
      )
    }

    // Process layaway payment
    if (order.orderType === 'LAYAWAY' && order.balanceAmount > 0 && 
        ['CONFIRMED', 'PARTIALLY_PAID'].includes(order.status)) {
      return (
        <Button asChild>
          <Link href={`/orders/${order.id}/payment`}>
            <CreditCard className="mr-2 h-4 w-4" />
            Process Payment
          </Link>
        </Button>
      )
    }

    // Mark as ready for collection (for fully paid orders that aren't ready yet)
    if (order.balanceAmount === 0 && 
        ['FULLY_PAID', 'CONFIRMED'].includes(order.status) &&
        order.orderType !== 'IMMEDIATE_SALE') {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isMarkingReady}>
              <Package className="mr-2 h-4 w-4" />
              {isMarkingReady ? "Marking Ready..." : "Mark Ready for Collection"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark Order Ready</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this order as ready for collection? 
                The customer will be notified that their order is ready for pickup.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMarkReady}>
                Mark Ready
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    // Complete collection
    if (order.status === 'READY_FOR_COLLECTION') {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isCompletingCollection}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {isCompletingCollection ? "Completing..." : "Complete Collection"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Collection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this order as collected? 
                This action will complete the order and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCompleteCollection}>
                Complete Collection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    // Show order reversal for completed orders
    if (order.status === 'COMPLETED') {
      return (
        <Button variant="outline" asChild>
          <Link href={`/orders/${order.id}/reverse`}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reverse Order
          </Link>
        </Button>
      )
    }

    // No primary action available
    return null
  }

  // Show warning for overdue orders
  const isOverdue = () => {
    if (order.orderType === 'LAYAWAY' && order.status === 'PARTIALLY_PAID') {
      // This would need actual payment due date logic
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return new Date(order.createdDate) < sevenDaysAgo
    }
    
    if (order.status === 'READY_FOR_COLLECTION') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return new Date(order.createdDate) < sevenDaysAgo
    }
    
    return false
  }

  const primaryAction = getPrimaryAction()

  return (
    <div className="flex items-center gap-2">
      {isOverdue() && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      )}
      
      {primaryAction}
      
      {/* Secondary actions */}
      {order.status !== 'CANCELLED' && order.status !== 'REVERSED' && (
        <Button variant="outline" asChild>
          <Link href={`/orders/${order.id}/print`}>
            Print
          </Link>
        </Button>
      )}
    </div>
  )
}