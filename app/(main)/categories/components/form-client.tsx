// app/(main)/categories/components/form-client.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createCategoryAction, updateCategoryAction } from "@/actions/categories"
import type { ProductCategoryDTO } from "@/lib/http-service/categories/types"

interface FormClientProps {
  category?: ProductCategoryDTO | null
  returnUrl: string
}

export function FormClient({ category, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (category) {
        // Update existing category
        result = await updateCategoryAction(formData, category.id)
      } else {
        // Create new category
        result = await createCategoryAction(formData)
      }

      if (result.success) {
        toast({
          title: category ? "Category updated" : "Category created",
          description: category ? "Category has been updated successfully" : "Category has been created successfully",
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
          Category Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name || ""}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}