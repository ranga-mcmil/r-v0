// app/(main)/orders/components/order-filters.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface OrderFiltersProps {
  currentParams: Record<string, string>
}

export function OrderFilters({ currentParams }: OrderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const hasActiveFilters = Object.keys(currentParams).some(key => 
    key !== 'page' && key !== 'size' && key !== 'tab' && currentParams[key]
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams(searchParams)

    // Add all form fields to params if they have values
    formData.forEach((value, key) => {
      if (value && value.toString().trim() && value.toString().trim() !== "all") {
        params.set(key, value.toString().trim())
      } else {
        params.delete(key)
      }
    })

    // Keep the current tab
    params.set('tab', 'all')
    // Reset to page 1 when filtering
    params.set('page', '1')

    router.push(`/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/orders?tab=all')
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
            Filter Orders
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
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
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