"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductForm } from "@/components/product-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Loading from "./loading"

// Mock products data for demonstration
const products = [
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
    status: "active",
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
    status: "active",
  },
]

export function ProductEditClient({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const productId = params.id
  const [product, setProduct] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const foundProduct = products.find((p) => p.id === productId)

        if (!foundProduct) {
          toast({
            title: "Product not found",
            description: "The requested product could not be found.",
            variant: "destructive",
          })
          router.push("/products")
          return
        }

        setProduct(foundProduct)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId, router, toast])

  const handleSuccess = () => {
    toast({
      title: "Product updated",
      description: "The product has been updated successfully",
    })
    router.push(`/products`)
  }

  // Show loading skeleton until data is ready
  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/products`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product {product?.name}</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>

        <Card className="p-6">
          {product && <ProductForm productId={productId} initialData={product} onClose={handleSuccess} />}
        </Card>
      </main>
    </div>
  )
}
