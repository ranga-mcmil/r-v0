// app/(main)/pos/components/cart-items.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

interface CartItem {
  id: string // Add unique ID for each cart item
  productId: number
  name: string
  price: number
  quantity: number
  length: number
  width: number
  weight: number
  discount: number
  notes?: string
  typeOfProduct: string
}

interface CartItemsProps {
  items: CartItem[]
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void
  onRemoveItem: (id: string) => void
  getLineTotal: (item: CartItem) => number
}

export function CartItems({ items, onUpdateItem, onRemoveItem, getLineTotal }: CartItemsProps) {
  const DEFAULT_WIDTH = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_WIDTH || '1')

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No items in cart
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <div className="text-sm text-muted-foreground">
                ${item.price.toFixed(2)} per unit
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onRemoveItem(item.id)}
              type="button"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Conditional input fields based on product type */}
          <div className="mt-2">
            {/* Length fields with Quantity - for LENGTH_WIDTH products (removed width) */}
            {item.typeOfProduct === "LENGTH_WIDTH" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="h-8 text-center"
                    min="1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Length (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={item.length}
                    onChange={(e) => onUpdateItem(item.id, { length: parseFloat(e.target.value) || 1 })}
                    className="h-8 text-center"
                    min="0.1"
                  />
                </div>
              </div>
            )}

            {/* Weight field with Quantity - for WEIGHT products */}
            {item.typeOfProduct === "WEIGHT" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="h-8 text-center"
                    min="1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={item.weight}
                    onChange={(e) => onUpdateItem(item.id, { weight: parseFloat(e.target.value) || 1 })}
                    className="h-8 text-center"
                    min="0.1"
                  />
                </div>
              </div>
            )}

            {/* Quantity only - for UNKNOWN products */}
            {item.typeOfProduct === "UNKNOWN" && (
              <div className="grid grid-cols-1">
                <div>
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="h-8 text-center"
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Discount field for all products */}
            <div className="mt-2">
              <Label className="text-xs">Discount (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={item.discount}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0
                  if (discount >= 0 && discount <= 100) {
                    onUpdateItem(item.id, { discount })
                  }
                }}
                className="h-8 text-center"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="mt-2 text-right">
            {/* Display appropriate measurement based on product type */}
            {item.typeOfProduct === "LENGTH_WIDTH" && (
              <div className="text-sm text-muted-foreground">
                Area: {(item.length * DEFAULT_WIDTH).toFixed(2)} m²
              </div>
            )}
            {item.typeOfProduct === "WEIGHT" && (
              <div className="text-sm text-muted-foreground">
                Weight: {item.weight.toFixed(2)} kg
              </div>
            )}
            {item.typeOfProduct === "UNKNOWN" && (
              <div className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </div>
            )}
            
            {/* Show discount amount if applicable */}
            {item.discount > 0 && (
              <div className="text-sm text-green-600">
                -{item.discount}% discount
              </div>
            )}
            
            {/* Show line total */}
            <div className="font-medium">
              ${getLineTotal(item).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}