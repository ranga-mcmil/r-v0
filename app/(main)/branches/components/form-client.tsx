// app/(main)/branches/components/form-client.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createBranchAction, updateBranchAction } from "@/actions/branches"
import type { BranchDTO } from "@/lib/http-service/branches/types"

interface FormClientProps {
  branch?: BranchDTO | null
  returnUrl: string
}

export function FormClient({ branch, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (branch) {
        // Update existing branch
        result = await updateBranchAction(formData, branch.id)
      } else {
        // Create new branch
        result = await createBranchAction(formData)
      }

      if (result.success) {
        toast({
          title: branch ? "Branch updated" : "Branch created",
          description: branch ? "Branch has been updated successfully" : "Branch has been created successfully",
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Branch Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={branch?.name || ""}
            placeholder="Enter branch name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            defaultValue={branch?.location || ""}
            placeholder="Enter location description"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Information</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="street">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="street"
              name="street"
              defaultValue={branch?.address?.street || ""}
              placeholder="Enter street address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              defaultValue={branch?.address?.city || ""}
              placeholder="Enter city"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="province">
              Province <span className="text-red-500">*</span>
            </Label>
            <Input
              id="province"
              name="province"
              defaultValue={branch?.address?.province || ""}
              placeholder="Enter province/state"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              defaultValue={branch?.address?.country || ""}
              placeholder="Enter country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              defaultValue={branch?.address?.postalCode || ""}
              placeholder="Enter postal code"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : branch ? "Update Branch" : "Create Branch"}
        </Button>
      </div>
    </form>
  )
}