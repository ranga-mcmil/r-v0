// app/(main)/production/components/form-client.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { createProductionAction } from "@/actions/productions"
import { getAllOrdersAction } from "@/actions/orders"
import { getInventoryAdjustmentsAction, getInventoryByBranchAction } from "@/actions/inventory"

interface FormClientProps {
  returnUrl: string
}

export function FormClient({ returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialOrderId = searchParams.get('orderId') || ""
  const initialInventoryId = searchParams.get('inventoryId') || ""

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [ordersRes, inventoryRes] = await Promise.all([
          getAllOrdersAction(),
          getInventoryByBranchAction()
        ])

        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data.content)
        }
        if (inventoryRes.success && inventoryRes.data) {
          setInventory(inventoryRes.data.content)
        }

        if (initialOrderId) {
          setSelectedOrderId(initialOrderId)
        }
        if (initialInventoryId) {
          setSelectedInventoryId(initialInventoryId)
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
  }, [toast, initialOrderId, initialInventoryId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const orderId = parseInt(formData.get('orderId') as string)
    const inventoryId = parseInt(formData.get('inventoryId') as string)

    try {
      const result = await createProductionAction(formData, orderId, inventoryId)

      if (result.success) {
        toast({
          title: "Production created",
          description: "Production record has been created successfully",
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
          <Label htmlFor="orderId">
            Order <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="orderId" 
            value={selectedOrderId} 
            onValueChange={setSelectedOrderId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id.toString()}>
                  {order.orderNumber} - {order.customerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="inventoryId">
            Inventory Item <span className="text-red-500">*</span>
          </Label>
          <Select 
            name="inventoryId" 
            value={selectedInventoryId} 
            onValueChange={setSelectedInventoryId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select inventory" />
            </SelectTrigger>
            <SelectContent>
              {inventory.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.productName} - {item.batchNumber} ({item.quantity} units)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          placeholder="Enter production quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          name="remarks"
          placeholder="Enter production remarks (optional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Production"}
        </Button>
      </div>
    </form>
  )
}