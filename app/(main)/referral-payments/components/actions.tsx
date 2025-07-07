// app/(main)/referral-payments/components/actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, XCircle, DollarSign, Ban, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  approveReferralPaymentAction,
  rejectReferralPaymentAction,
  markReferralPaymentAsPaidAction,
  cancelReferralPaymentAction
} from "@/actions/referral-payments"

interface ActionsProps {
  referralPaymentId: number
  currentStatus: string
}

export function Actions({ referralPaymentId, currentStatus }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleStatusUpdate = async (action: () => Promise<any>, successMessage: string) => {
    setIsLoading(true)
    try {
      const result = await action()
      if (result.success) {
        toast({
          title: "Success",
          description: successMessage,
        })
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
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
      setIsLoading(false)
    }
  }

  const canApprove = currentStatus === 'PENDING'
  const canReject = currentStatus === 'PENDING'
  const canMarkPaid = currentStatus === 'APPROVED'
  const canCancel = ['PENDING', 'APPROVED'].includes(currentStatus)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canApprove && (
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate(
              () => approveReferralPaymentAction(referralPaymentId),
              "Payment approved successfully"
            )}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Payment
          </DropdownMenuItem>
        )}
        {canReject && (
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate(
              () => rejectReferralPaymentAction(referralPaymentId),
              "Payment rejected"
            )}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject Payment
          </DropdownMenuItem>
        )}
        {canMarkPaid && (
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate(
              () => markReferralPaymentAsPaidAction(referralPaymentId),
              "Payment marked as paid"
            )}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Mark as Paid
          </DropdownMenuItem>
        )}
        {canCancel && (
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate(
              () => cancelReferralPaymentAction(referralPaymentId),
              "Payment cancelled"
            )}
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancel Payment
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}