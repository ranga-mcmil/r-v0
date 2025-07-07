// app/(main)/batches/components/form-client.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { BatchDTO } from "@/lib/http-service/batches/types"

interface FormClientProps {
  batch?: BatchDTO | null
  returnUrl: string
}

export function FormClient({ batch, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (batch) {
        // Update existing batch - import action dynamically to avoid build issues
        const { updateBatchAction } = await import("@/actions/batches")
        result = await updateBatchAction(formData, batch.id)
      } else {
        // Create new batch - get branchId from session
        if (!session?.user.branchId && session?.user.role !== 'ROLE_ADMIN') {
          toast({
            title: "Error",
            description: "You must be assigned to a branch to create batches",
            variant: "destructive",
          })
          return
        }

        // Use branchId from session for creation
        const branchId = session.user.branchId!
        const { createBatchAction } = await import("@/actions/batches")
        result = await createBatchAction(formData, branchId)
      }

      if (result.success) {
        toast({
          title: batch ? "Batch updated" : "Batch created",
          description: batch ? "Batch has been updated successfully" : "Batch has been created successfully",
        })
        router.push(returnUrl)
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="batchNumber">
          Batch Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="batchNumber"
          name="batchNumber"
          defaultValue={batch?.batchNumber || ""}
          placeholder="Enter batch number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={batch?.description || ""}
          placeholder="Enter batch description (optional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : batch ? "Update Batch" : "Create Batch"}
        </Button>
      </div>
    </form>
  )
}