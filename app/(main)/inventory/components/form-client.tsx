// app/(main)/inventory/components/form-client.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { addInventoryAction, adjustInventoryAction } from "@/actions/inventory"
import { getProductsAction } from "@/actions/products"
import { getBatchesAction } from "@/actions/batches"
import type { ProductDTO } from "@/lib/http-service/products/types"
import type { BatchDTO } from "@/lib/http-service/batches/types"

interface FormClientProps {
  mode: "add" | "adjust"
  movementType?: string
  returnUrl: string
}

export function FormClient({ mode, movementType, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [batches, setBatches] = useState<BatchDTO[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [selectedBatchId, setSelectedBatchId] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params
  const initialProductId = searchParams.get('productId') || ""
  const initialBatchId = searchParams.get('batchId') || ""

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [productsRes, batchesRes] = await Promise.all([
          getProductsAction(),
          getBatchesAction()
        ])

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data.content)
        }
        if (batchesRes.success && batchesRes.data) {
          setBatches(batchesRes.data.content)
        }

        // Set initial values
        if (initialProductId) {
          setSelectedProductId(initialProductId)
        }
        if (initialBatchId) {
          setSelectedBatchId(initialBatchId)
        }
      } catch (error) {
        console.error("Error loading form data:", error)
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFormData()
  }, [toast, initialProductId, initialBatchId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const productId = parseInt(formData.get('productId') as string)
    const batchId = parseInt(formData.get('batchId') as string)

    try {
      let result

      if (mode === "add") {
        result = await addInventoryAction(formData, productId, batchId)
      } else {
        const adjustmentType = movementType || "manual_adjustment"
        result = await adjustInventoryAction(formData, productId, batchId, adjustmentType)
      }

      if (result.success) {
        toast({
          title: mode === "add" ? "Inventory added" : "Inventory adjusted",
          description: mode === "add" 
            ? "Inventory has been added successfully" 
            : "Inventory has been adjusted successfully",
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
          <Label htmlFor="productId">
            Product <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="productId" 
            value={selectedProductId} 
            onValueChange={setSelectedProductId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name || `Product ${product.code}`} - {product.colorName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="batchId">
            Batch <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="batchId" 
            value={selectedBatchId} 
            onValueChange={setSelectedBatchId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id.toString()}>
                  {batch.batchNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            name="length"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            name="width"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">
          Quantity <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Enter quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">
          {mode === "adjust" ? "Reason" : "Remarks"}
          {mode === "adjust" && <span className="text-red-500"> *</span>}
        </Label>
        <Textarea
          id="remarks"
          name="remarks"
          placeholder={mode === "adjust" ? "Enter reason for adjustment" : "Enter remarks (optional)"}
          rows={3}
          required={mode === "adjust"}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "add" ? "Add Inventory" : "Adjust Inventory"}
        </Button>
      </div>
    </form>
  )
}