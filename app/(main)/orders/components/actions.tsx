// app/(main)/orders/components/actions.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Edit, 
  CreditCard, 
  CheckCircle, 
  Package, 
  RotateCcw, 
  FileText, 
  MoreHorizontal,
  ArrowRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { 
  markReadyForCollectionAction, 
  completeCollectionAction 
} from "@/actions/orders"

interface ActionsProps {
  orderId: number
  orderType: string
  status: string
  orderNumber: string
}

export function Actions({ orderId, orderType, status, orderNumber }: ActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleMarkReady = async () => {
    setIsProcessing(true)
    
    try {
      const result = await markReadyForCollectionAction(orderId)
      
      if (result.success) {
        toast({
          title: "Order marked ready",
          description: "Order has been marked ready for collection",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark order ready",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Mark ready error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCompleteCollection = async () => {
    setIsProcessing(true)
    
    try {
      const result = await completeCollectionAction(orderId)
      
      if (result.success) {
        toast({
          title: "Collection completed",
          description: "Order collection has been completed",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to complete collection",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Complete collection error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const canConvert = orderType === 'QUOTATION' && status === 'PENDING'
  const canMarkReady = ['CONFIRMED', 'FULLY_PAID'].includes(status) && orderType !== 'IMMEDIATE_SALE'
  const canCompleteCollection = status === 'READY_FOR_COLLECTION'
  const canMakePayment = orderType === 'LAYAWAY' && ['CONFIRMED', 'PARTIALLY_PAID'].includes(status)
  const canReverse = !['COMPLETED', 'CANCELLED', 'REVERSED'].includes(status)

  return (
    <div className="flex gap-2">
      {/* Quick Actions */}
      {canMarkReady && (
        <Button 
          variant="outline" 
          onClick={handleMarkReady}
          disabled={isProcessing}
        >
          <Package className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Mark Ready"}
        </Button>
      )}

      {canCompleteCollection && (
        <Button 
          onClick={handleCompleteCollection}
          disabled={isProcessing}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Complete Collection"}
        </Button>
      )}

      {canMakePayment && (
        <Button variant="outline" asChild>
          <Link href={`/orders/${orderId}/payment`}>
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Link>
        </Button>
      )}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {canConvert && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/convert?type=IMMEDIATE_SALE`}>
                  <ArrowRight className="mr-2 h-4 w-4 text-green-600" />
                  Convert to Sale
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/convert?type=LAYAWAY`}>
                  <ArrowRight className="mr-2 h-4 w-4 text-orange-600" />
                  Convert to Layaway
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/convert?type=FUTURE_COLLECTION`}>
                  <ArrowRight className="mr-2 h-4 w-4 text-purple-600" />
                  Convert to Future Collection
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/orders/${orderId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Link>
          </DropdownMenuItem>

          {orderType === 'LAYAWAY' && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/layaway-summary`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Layaway Summary
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/payments`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment History
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/stock-movements?orderNumber=${orderNumber}`}>
              <Package className="mr-2 h-4 w-4" />
              View Stock Movements
            </Link>
          </DropdownMenuItem>

          {canReverse && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/reverse`}>
                  <RotateCcw className="mr-2 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Reverse Order</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}