// app/(main)/orders/components/search-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getCustomersAction } from "@/actions/customers"
import { getBranchesAction } from "@/actions/branches"
import type { CustomerDTO } from "@/lib/http-service/customers/types"
import type { BranchDTO } from "@/lib/http-service/branches/types"

interface SearchFormProps {
  currentParams: Record<string, string>
  canViewAllBranches: boolean
}

export function SearchForm({ currentParams, canViewAllBranches }: SearchFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [branches, setBranches] = useState<BranchDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if any filters are applied
  const hasActiveFilters = Object.keys(currentParams).some(key => 
    key !== 'page' && key !== 'size' && currentParams[key]
  )

  useEffect(() => {
    if (isExpanded && customers.length === 0) {
      loadFormData()
    }
  }, [isExpanded])

  const loadFormData = async () => {
    setIsLoading(true)
    try {
      const promises = [getCustomersAction()]
      
      if (canViewAllBranches) {
        promises.push(getBranchesAction())
      }

      const [customersRes, branchesRes] = await Promise.all(promises)

      if (customersRes.success && customersRes.data) {
        setCustomers(customersRes.data.content)
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

    router.push(`/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/orders')
    setIsExpanded(false)
  }

  const orderTypes = [
    { value: 'QUOTATION', label: 'Quotation' },
    { value: 'IMMEDIATE_SALE', label: 'Immediate Sale' },
    { value: 'FUTURE_COLLECTION', label: 'Future Collection' },
    { value: 'LAYAWAY', label: 'Layaway' },
  ]

  const orderStatuses = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
    { value: 'FULLY_PAID', label: 'Fully Paid' },
    { value: 'READY_FOR_COLLECTION', label: 'Ready for Collection' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REVERSED', label: 'Reversed' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Orders
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
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  placeholder="Search by order number"
                  defaultValue={currentParams.orderNumber || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Search by customer name"
                  defaultValue={currentParams.customerName || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderType">Order Type</Label>
                <Select name="orderType" defaultValue={currentParams.orderType || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {orderTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={currentParams.status || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Select name="customerId" defaultValue={currentParams.customerId || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.firstName} {customer.lastName}
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
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={currentParams.startDate || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={currentParams.endDate || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select name="sortBy" defaultValue={currentParams.sortBy || "createdDate"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdDate">Created Date</SelectItem>
                    <SelectItem value="orderNumber">Order Number</SelectItem>
                    <SelectItem value="totalAmount">Total Amount</SelectItem>
                    <SelectItem value="customerName">Customer Name</SelectItem>
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