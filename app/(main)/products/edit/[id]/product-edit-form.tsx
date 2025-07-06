"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ProductForm } from "@/components/product-form"
import { useToast } from "@/hooks/use-toast"

// Mock data for testing
const mockProducts = [
  {
    id: "ibr-1",
    name: "IBR Sheet - Red",
    sku: "IBR-RED-26-3.6",
    price: 45.99,
    category: "ibr",
    color: "Red",
    gauge: "26",
    length: 3.6,
    stock: 150,
    status: "In Stock",
  },
  {
    id: "ibr-2",
    name: "IBR Sheet - Blue",
    sku: "IBR-BLUE-26-3.6",
    price: 45.99,
    category: "ibr",
    color: "Blue",
    gauge: "26",
    length: 3.6,
    stock: 120,
    status: "In Stock",
  },
]

export function ProductEditForm({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
        const foundProduct = mockProducts.find((p) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          })
          router.push("/products")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        })
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const handleSubmit = async (formData) => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      })

      router.push("/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Update the product information below</CardDescription>
          </CardHeader>
          <CardContent>
            {product && <ProductForm initialData={product} onSubmit={handleSubmit} isSubmitting={saving} />}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
