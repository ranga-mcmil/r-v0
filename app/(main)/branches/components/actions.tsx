// app/(main)/branches/components/actions.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { activateBranchAction, deactivateBranchAction } from "@/actions/branches"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ActionsProps {
  branchId: string
  branchName: string
  isActive: boolean
}

export function Actions({ branchId, branchName, isActive }: ActionsProps) {
  const [isToggling, setIsToggling] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleToggleStatus = async () => {
    setIsToggling(true)
    
    try {
      const result = isActive 
        ? await deactivateBranchAction(branchId)
        : await activateBranchAction(branchId)
      
      if (result.success) {
        toast({
          title: `Branch ${isActive ? 'deactivated' : 'activated'}`,
          description: `${branchName} has been ${isActive ? 'deactivated' : 'activated'} successfully`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update branch status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Status toggle error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isActive ? (
          <XCircle className="mr-2 h-4 w-4" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        {isToggling ? "Updating..." : isActive ? "Deactivate" : "Activate"}
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/branches/edit/${branchId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/branches/delete/${branchId}`}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Link>
      </Button>
    </div>
  )
}