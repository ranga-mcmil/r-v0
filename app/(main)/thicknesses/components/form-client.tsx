// app/(main)/thicknesses/components/form-client.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createThicknessAction, updateThicknessAction } from "@/actions/thicknesses"
import type { ThicknessDTO } from "@/lib/http-service/thicknesses/types"

interface FormClientProps {
  thickness?: ThicknessDTO | null
  returnUrl: string
}

export function FormClient({ thickness, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (thickness) {
        // Update existing thickness
        result = await updateThicknessAction(formData, thickness.id)
      } else {
        // Create new thickness
        result = await createThicknessAction(formData)
      }

      if (result.success) {
        toast({
          title: thickness ? "Thickness updated" : "Thickness created",
          description: thickness ? "Thickness has been updated successfully" : "Thickness has been created successfully",
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
        <Label htmlFor="thickness">
          Thickness (mm) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="thickness"
          name="thickness"
          type="number"
          step="0.01"
          min="0"
          defaultValue={thickness?.thickness || ""}
          placeholder="Enter thickness value"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : thickness ? "Update Thickness" : "Create Thickness"}
        </Button>
      </div>
    </form>
  )
}