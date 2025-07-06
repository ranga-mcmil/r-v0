"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCheck, UserMinus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { changeUserStatus } from "../actions"

interface StatusChangeButtonProps {
  userId: string
  currentStatus: string
}

export function StatusChangeButton({ userId, currentStatus }: StatusChangeButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showDialog, setShowDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const isActive = currentStatus === "active"
  const newStatus = isActive ? "inactive" : "active"

  const handleStatusChange = () => {
    setIsProcessing(true)

    changeUserStatus(userId, newStatus as "active" | "inactive")
      .then((result) => {
        if (result.success) {
          toast({
            title: "User status updated",
            description: result.message,
          })
          router.refresh()
        } else {
          toast({
            title: "Update failed",
            description: result.message,
            variant: "destructive",
          })
        }
      })
      .catch((error) => {
        toast({
          title: "Update failed",
          description: "An error occurred while updating the user status",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsProcessing(false)
        setShowDialog(false)
      })
  }

  return (
    <>
      <Button
        variant={isActive ? "outline" : "default"}
        className="w-full"
        onClick={() => setShowDialog(true)}
        disabled={isProcessing}
      >
        {isActive ? (
          <>
            <UserMinus className="mr-2 h-4 w-4" />
            Deactivate User
          </>
        ) : (
          <>
            <UserCheck className="mr-2 h-4 w-4" />
            Activate User
          </>
        )}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isActive ? "Deactivate User" : "Activate User"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? "This will prevent the user from accessing the system. They will remain in the system but will not be able to log in."
                : "This will allow the user to access the system again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange} disabled={isProcessing}>
              {isProcessing ? "Processing..." : isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
