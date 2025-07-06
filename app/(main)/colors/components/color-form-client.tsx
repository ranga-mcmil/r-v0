// app/(main)/colors/components/color-form-client.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createColorAction, updateColorAction } from "@/actions/colors"
import type { ColorDTO } from "@/lib/http-service/colors/types"

interface ColorFormProps {
  color?: ColorDTO | null
  returnUrl: string
}

export function ColorFormClient({ color, returnUrl }: ColorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (color) {
        // Update existing color
        result = await updateColorAction(formData, color.id)
      } else {
        // Create new color
        result = await createColorAction(formData)
      }

      if (result.success) {
        toast({
          title: color ? "Color updated" : "Color created",
          description: color ? "Color has been updated successfully" : "Color has been created successfully",
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
        <Label htmlFor="name">
          Color Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={color?.name || ""}
          placeholder="Enter color name"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : color ? "Update Color" : "Create Color"}
        </Button>
      </div>
    </form>
  )
}