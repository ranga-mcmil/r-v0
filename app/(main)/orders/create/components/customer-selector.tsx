//app/(main)/orders/create/components/customer-selector.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, User } from "lucide-react"
import { getCustomersAction } from "@/actions/customers"
import type { CustomerDTO } from "@/lib/http-service/customers/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateCustomerForm } from "./create-customer-form"

interface CustomerSelectorProps {
  onCustomerSelect: (customerId: number) => void
  selectedCustomerId: number | null
}

export function CustomerSelector({ onCustomerSelect, selectedCustomerId }: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerDTO[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers.slice(0, 10)) // Show first 10 by default
    }
  }, [customers, searchTerm])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const result = await getCustomersAction({ pageSize: 100 })
      if (result.success && result.data) {
        setCustomers(result.data.content)
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerCreated = (newCustomer: CustomerDTO) => {
    setCustomers(prev => [newCustomer, ...prev])
    onCustomerSelect(newCustomer.id)
    setShowCreateDialog(false)
  }

  if (selectedCustomer) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedCustomer.phoneNumber}
                </div>
                {selectedCustomer.email && (
                  <div className="text-sm text-muted-foreground">
                    {selectedCustomer.email}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCustomerSelect(null as any)}
            >
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="customer-search">Search Customers</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="customer-search"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Create New Customer */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Customer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to the system
            </DialogDescription>
          </DialogHeader>
          <CreateCustomerForm onCustomerCreated={handleCustomerCreated} />
        </DialogContent>
      </Dialog>

      {/* Customer List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {searchTerm ? 'No customers found matching your search' : 'No customers available'}
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card 
              key={customer.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onCustomerSelect(customer.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.phoneNumber}
                    </div>
                    {customer.email && (
                      <div className="text-sm text-muted-foreground">
                        {customer.email}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">Select</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {searchTerm && filteredCustomers.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          Showing {filteredCustomers.length} result{filteredCustomers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}