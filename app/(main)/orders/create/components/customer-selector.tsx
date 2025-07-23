//app/(main)/orders/create/components/customer-selector.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Plus, User, Search } from "lucide-react"
import { getCustomersAction } from "@/actions/customers"
import type { CustomerDTO } from "@/lib/http-service/customers/types"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const result = await getCustomersAction({ pageSize: 200 }) // Load more for search
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

  const formatCustomerLabel = (customer: CustomerDTO) => {
    return `${customer.firstName} ${customer.lastName}`
  }

  const formatCustomerSubtext = (customer: CustomerDTO) => {
    const parts = [customer.phoneNumber]
    if (customer.email) parts.push(customer.email)
    return parts.join(' • ')
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
                  {formatCustomerLabel(selectedCustomer)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatCustomerSubtext(selectedCustomer)}
                </div>
                {selectedCustomer.address && (
                  <div className="text-sm text-muted-foreground">
                    {selectedCustomer.address}
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
      <div className="space-y-2">
        <Label>Select Customer *</Label>
        
        {/* Customer Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search customers...</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search customers by name, phone, or email..." />
              <CommandList>
                <CommandEmpty>
                  <div className="text-center py-6">
                    <User className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No customers found.</p>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={`${customer.firstName} ${customer.lastName} ${customer.phoneNumber} ${customer.email || ''}`}
                      onSelect={() => {
                        onCustomerSelect(customer.id)
                        setOpen(false)
                      }}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {formatCustomerLabel(customer)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCustomerSubtext(customer)}
                          </div>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowCreateDialog(true)
                    }}
                    className="text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new customer
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Create New Customer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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

      {/* Alternative: Manual Entry Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Or create new customer
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

      {loading && (
        <div className="text-sm text-muted-foreground text-center">
          Loading customers...
        </div>
      )}
    </div>
  )
}