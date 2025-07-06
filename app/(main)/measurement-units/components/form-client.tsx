// app/(main)/measurement-units/components/form-client.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createMeasurementUnitAction, updateMeasurementUnitAction } from "@/actions/measurement-units"
import type { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types"

interface FormClientProps {
  measurementUnit?: MeasurementUnitDTO | null
  returnUrl: string
}

export function FormClient({ measurementUnit, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (measurementUnit) {
        // Update existing measurement unit
        result = await updateMeasurementUnitAction(formData, measurementUnit.id)
      } else {
        // Create new measurement unit
        result = await createMeasurementUnitAction(formData)
      }

      if (result.success) {
        toast({
          title: measurementUnit ? "Unit updated" : "Unit created",
          description: measurementUnit ? "Measurement unit has been updated successfully" : "Measurement unit has been created successfully",
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
        <Label htmlFor="unitOfMeasure">
          Unit of Measure <span className="text-red-500">*</span>
        </Label>
        <Input
          id="unitOfMeasure"
          name="unitOfMeasure"
          defaultValue={measurementUnit?.unitOfMeasure || ""}
          placeholder="Enter unit of measure (e.g., kg, meters, pieces)"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : measurementUnit ? "Update Unit" : "Create Unit"}
        </Button>
      </div>
    </form>
  )
}