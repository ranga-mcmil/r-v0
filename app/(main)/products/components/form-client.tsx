// app/(main)/products/components/form-client.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createProductAction, updateProductAction } from "@/actions/products"
import { getCategoriesAction } from "@/actions/categories"
import { getColorsAction } from "@/actions/colors"
import { getThicknessesAction } from "@/actions/thicknesses"
import { getMeasurementUnitsAction } from "@/actions/measurement-units"
import type { ProductDTO } from "@/lib/http-service/products/types"
import type { ProductCategoryDTO } from "@/lib/http-service/categories/types"
import type { ColorDTO } from "@/lib/http-service/colors/types"
import type { ThicknessDTO } from "@/lib/http-service/thicknesses/types"
import type { MeasurementUnitDTO } from "@/lib/http-service/measurement-units/types"

interface FormClientProps {
  product?: ProductDTO | null
  returnUrl: string
}

export function FormClient({ product, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<ProductCategoryDTO[]>([])
  const [colors, setColors] = useState<ColorDTO[]>([])
  const [thicknesses, setThicknesses] = useState<ThicknessDTO[]>([])
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([])
  const [isReferable, setIsReferable] = useState(product?.isReferable || false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [categoriesRes, colorsRes, thicknessesRes, unitsRes] = await Promise.all([
          getCategoriesAction(),
          getColorsAction(),
          getThicknessesAction(),
          getMeasurementUnitsAction()
        ])

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data)
        }
        if (colorsRes.success && colorsRes.data) {
          setColors(colorsRes.data)
        }
        if (thicknessesRes.success && thicknessesRes.data) {
          setThicknesses(thicknessesRes.data)
        }
        if (unitsRes.success && unitsRes.data) {
          setMeasurementUnits(unitsRes.data)
        }
      } catch (error) {
        console.error("Error loading form data:", error)
        toast({
          title: "Error",
          description: "Failed to load form options",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFormData()
  }, [toast])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (product) {
        // Update existing product
        result = await updateProductAction(formData, product.id)
      } else {
        // Create new product
        result = await createProductAction(formData)
      }

      if (result.success) {
        toast({
          title: product ? "Product updated" : "Product created",
          description: product ? "Product has been updated successfully" : "Product has been created successfully",
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading form data...</div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name || ""}
            placeholder="Enter product name (optional)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">
            Product Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            name="code"
            type="number"
            defaultValue={product?.code || ""}
            placeholder="Enter product code"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="colorId">
            Color <span className="text-red-500">*</span>
          </Label>
          <Select name="colorId" defaultValue={product ? product.id.toString() : ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id.toString()}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="thicknessId">
            Thickness <span className="text-red-500">*</span>
          </Label>
          <Select name="thicknessId" defaultValue={product ? product.id.toString() : ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select thickness" />
            </SelectTrigger>
            <SelectContent>
              {thicknesses.map((thickness) => (
                <SelectItem key={thickness.id} value={thickness.id.toString()}>
                  {thickness.thickness}mm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="productCategoryId">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select name="productCategoryId" defaultValue={product ? product.id.toString() : ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitOfMeasureId">
            Unit of Measure <span className="text-red-500">*</span>
          </Label>
          <Select name="unitOfMeasureId" defaultValue={product ? product.id.toString() : ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {measurementUnits.map((unit) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  {unit.unitOfMeasure}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price || ""}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="typeOfProduct">
            Type of Product <span className="text-red-500">*</span>
          </Label>
          <Select name="typeOfProduct" defaultValue={product?.typeOfProduct || ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LENGTH_WIDTH">Length & Width</SelectItem>
              <SelectItem value="WEIGHT">Weight</SelectItem>
              <SelectItem value="UNKNOWN">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isReferable" 
            name="isReferable"
            checked={isReferable}
            onCheckedChange={(checked) => setIsReferable(!!checked)}
          />
          <Label htmlFor="isReferable">Enable referral program for this product</Label>
        </div>
        
        {isReferable && (
          <div className="space-y-2">
            <Label htmlFor="referrablePercentage">
              Referral Percentage <span className="text-red-500">*</span>
            </Label>
            <Input
              id="referrablePercentage"
              name="referrablePercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              defaultValue={product?.referrablePercentage || ""}
              placeholder="0.00"
              required={isReferable}
            />
            <p className="text-sm text-muted-foreground">
              Percentage of product price paid as referral commission (0-100%)
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}