// app/(main)/stock-movements/components/search-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getProductsAction } from "@/actions/products"
import { getBranchesAction } from "@/actions/branches"
import type { ProductDTO } from "@/lib/http-service/products/types"
import type { BranchDTO } from "@/lib/http-service/branches/types"

interface SearchFormProps {
  currentParams: Record<string, string>
  canViewAllBranches: boolean
}

export function SearchForm({ currentParams, canViewAllBranches }: SearchFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [branches, setBranches] = useState<BranchDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if any filters are applied
  const hasActiveFilters = Object.keys(currentParams).some(key => 
    key !== 'page' && key !== 'size' && currentParams[key]
  )

  useEffect(() => {
    if (isExpanded && products.length === 0) {
      loadFormData()
    }
  }, [isExpanded])

  const loadFormData = async () => {
    setIsLoading(true)
    try {
      const promises = [getProductsAction()]
      
      if (canViewAllBranches) {
        promises.push(getBranchesAction())
      }

      const [productsRes, branchesRes] = await Promise.all(promises)

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.content)
      }
      
      if (branchesRes && branchesRes.success && branchesRes.data) {
        setBranches(branchesRes.data.content)
      }
    } catch (error) {
      console.error("Error loading form data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()

    // Add all form fields to params if they have values and are not "all"
    formData.forEach((value, key) => {
      if (value && value.toString().trim() && value.toString().trim() !== "all") {
        params.set(key, value.toString().trim())
      }
    })

    // Always reset to page 1 when searching
    params.set('page', '1')

    router.push(`/stock-movements?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/stock-movements')
    setIsExpanded(false)
  }

  const movementTypes = [
    { value: 'STOCK_ADDITION', label: 'Stock Addition' },
    { value: 'STOCK_INCREASE', label: 'Stock Increase' },
    { value: 'STOCK_DECREASE', label: 'Stock Decrease' },
    { value: 'ADJUSTMENT_INCREASE', label: 'Adjustment Increase' },
    { value: 'ADJUSTMENT_DECREASE', label: 'Adjustment Decrease' },
    { value: 'SALE', label: 'Sale' },
    { value: 'PRODUCTION', label: 'Production' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Stock Movements
            {hasActiveFilters && (
              <span className="text-sm font-normal text-muted-foreground">
                (Filters applied)
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="Search by product name"
                  defaultValue={currentParams.productName || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  placeholder="Search by order number"
                  defaultValue={currentParams.orderNumber || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdByName">Created By</Label>
                <Input
                  id="createdByName"
                  name="createdByName"
                  placeholder="Search by user name"
                  defaultValue={currentParams.createdByName || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Select name="productId" defaultValue={currentParams.productId || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name || `Product ${product.code}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="movementType">Movement Type</Label>
                <Select name="movementType" defaultValue={currentParams.movementType || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select movement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {movementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {canViewAllBranches && (
                <div className="space-y-2">
                  <Label htmlFor="branchId">Branch</Label>
                  <Select name="branchId" defaultValue={currentParams.branchId || "all"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  name="fromDate"
                  type="date"
                  defaultValue={currentParams.fromDate || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  name="toDate"
                  type="date"
                  defaultValue={currentParams.toDate || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isReversed">Status</Label>
                <Select name="isReversed" defaultValue={currentParams.isReversed || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="false">Active</SelectItem>
                    <SelectItem value="true">Reversed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
              {hasActiveFilters && (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  )
}