// app/(main)/pos/components/pos-client.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CreditCard, FileText, Loader2, Calendar, DollarSign, Search, Trash2, User, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import server actions
import { createCustomerAction } from "@/actions/customers"
import { 
  createQuotationAction, 
  createLayawayWithReferralAction, 
  createImmediateSaleWithReferralAction, 
  createFutureCollectionWithReferralAction 
} from "@/actions/orders"

// Import types
import { ProductDTO } from "@/lib/http-service/products/types"
import { CustomerDTO } from "@/lib/http-service/customers/types"
import { ReferralDTO } from "@/lib/http-service/referrals/types"
import { ProductCategoryDTO } from "@/lib/http-service/categories/types"
import { OrderType, PaymentMethod } from "@/lib/http-service/orders/types"

// Import components
import { ProductGrid } from "./product-grid"
import { CartItems } from "./cart-items"
import { CustomerForm } from "./customer-form"
import { ReferralForm } from "./referral-form"
import { OrderSummary } from "./order-summary"
import { LayawayConfig } from "./layaway-config"

// Enhanced cart item type with unique ID
interface CartItem {
  id: string // Unique identifier for each cart item
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
  isReferable?: boolean // Add isReferable property
  referrablePercentage?: number // Add referrable percentage
}

// Layaway configuration type
interface LayawayPlan {
  depositAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

interface POSClientProps {
  initialProducts: ProductDTO[]
  initialCustomers: CustomerDTO[]
  initialReferrals: ReferralDTO[]
  categories: ProductCategoryDTO[]
  userBranch?: string
  searchParams: {
    search?: string
    category?: string
  }
  hasInitialErrors: boolean
}

export function POSClient({ 
  initialProducts, 
  initialCustomers, 
  initialReferrals,
  categories, 
  userBranch,
  searchParams,
  hasInitialErrors 
}: POSClientProps) {
  // Get default width from environment
  const DEFAULT_WIDTH = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_WIDTH || '1')
  
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [products] = useState<ProductDTO[]>(initialProducts)
  const [customers, setCustomers] = useState<CustomerDTO[]>(initialCustomers)
  const [referrals, setReferrals] = useState<ReferralDTO[]>(initialReferrals)
  
  // UI states
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showReferralForm, setShowReferralForm] = useState(false)
  
  // Cart and form states
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedReferral, setSelectedReferral] = useState("none")
  const [orderType, setOrderType] = useState<OrderType>("IMMEDIATE_SALE")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [notes, setNotes] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [expectedCollectionDate, setExpectedCollectionDate] = useState("")
  
  // Layaway configuration state
  const [layawayPlan, setLayawayPlan] = useState<LayawayPlan>({
    depositAmount: 0,
    numberOfInstallments: 3,
    installmentFrequencyDays: 30,
    firstInstallmentDate: ""
  })

  const { toast } = useToast()
  const router = useRouter()

  // Show error if initial data failed to load
  useEffect(() => {
    if (hasInitialErrors) {
      toast({
        title: "Warning",
        description: "Some data failed to load. Please refresh the page if you encounter issues.",
        variant: "destructive",
      })
    }
  }, [hasInitialErrors, toast])

  // Auto-sync payment amount with deposit for layaway
  useEffect(() => {
    if (orderType === "LAYAWAY" && layawayPlan.depositAmount > 0) {
      setPaymentAmount(layawayPlan.depositAmount.toString())
    }
  }, [orderType, layawayPlan.depositAmount])

  // Generate unique ID for cart items
  const generateCartItemId = () => {
    return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Helper function to calculate line total based on product type
  const getLineTotal = (item: CartItem) => {
    let baseAmount = 0
    switch (item.typeOfProduct) {
      case "LENGTH_WIDTH":
        baseAmount = item.price * item.quantity * item.length * DEFAULT_WIDTH
        break
      case "WEIGHT":
        baseAmount = item.price * item.quantity * item.weight
        break
      case "UNKNOWN":
      default:
        baseAmount = item.price * item.quantity
        break
    }
    
    // Apply discount
    const discountAmount = baseAmount * (item.discount / 100)
    return baseAmount - discountAmount
  }

  // Cart operations - Updated to always add as new item
  const addToCart = (product: ProductDTO) => {
    const newItem: CartItem = {
      id: generateCartItemId(), // Generate unique ID
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      length: 1,
      width: DEFAULT_WIDTH, // Use environment variable
      weight: 1,
      discount: 0,
      notes: "",
      typeOfProduct: product.typeOfProduct,
      isReferable: product.isReferable, // Include isReferable from product
      referrablePercentage: product.referrablePercentage // Include referrable percentage
    }
    
    setCartItems(items => [...items, newItem])

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => {
      const newItems = items.filter(item => item.id !== id)
      
      // If no referable items remain, reset referral selection
      if (!newItems.some(item => item.isReferable === true)) {
        setSelectedReferral("none")
      }
      
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    setSelectedCustomer("")
    setSelectedReferral("none")
    setNotes("")
    setPaymentAmount("")
    setExpectedCollectionDate("")
    setLayawayPlan({
      depositAmount: 0,
      numberOfInstallments: 3,
      installmentFrequencyDays: 30,
      firstInstallmentDate: ""
    })
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + getLineTotal(item), 0)
  const taxRate = 0.15
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  // Check if any cart items are referable
  const hasReferableItems = cartItems.some(item => item.isReferable === true)

  // Calculate layaway installment amount
  const calculatedInstallmentAmount = layawayPlan.numberOfInstallments > 0 
    ? (total - layawayPlan.depositAmount) / layawayPlan.numberOfInstallments 
    : 0

  // Button validation logic
  const getButtonDisabledState = () => {
    if (isLoading) return { disabled: true, reason: 'Creating order...' }
    if (cartItems.length === 0) return { disabled: true, reason: 'Add items to cart' }
    if (!selectedCustomer) return { disabled: true, reason: 'Select a customer' }
    if (!userBranch) return { disabled: true, reason: 'No branch assigned to user' }

    // Order type specific validation
    if (orderType !== "QUOTATION") {
      if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
        return { disabled: true, reason: 'Enter payment amount' }
      }
      if (!paymentMethod) {
        return { disabled: true, reason: 'Select payment method' }
      }
    }

    // Layaway specific validation
    if (orderType === "LAYAWAY") {
      if (layawayPlan.depositAmount <= 0) {
        return { disabled: true, reason: 'Enter deposit amount' }
      }
      if (layawayPlan.depositAmount >= total) {
        return { disabled: true, reason: 'Deposit must be less than total' }
      }
      if (!layawayPlan.firstInstallmentDate) {
        return { disabled: true, reason: 'Select first payment date' }
      }
      if (parseFloat(paymentAmount || "0") !== layawayPlan.depositAmount) {
        return { disabled: true, reason: 'Payment amount must equal deposit' }
      }
    }

    // Immediate sale specific validation
    if (orderType === "IMMEDIATE_SALE") {
      const paymentFloat = parseFloat(paymentAmount || "0")
      if (paymentFloat < total) {
        return { disabled: true, reason: `Insufficient payment (need $${total.toFixed(2)})` }
      }
    }

    // Future collection specific validation
    if (orderType === "FUTURE_COLLECTION" && !expectedCollectionDate) {
      return { disabled: true, reason: 'Select collection date' }
    }

    return { disabled: false, reason: null }
  }

  const buttonState = getButtonDisabledState()

  // Handle customer creation
  const handleCustomerCreated = (customer: CustomerDTO) => {
    setCustomers(prev => [...prev, customer])
    setSelectedCustomer(customer.id.toString())
    setShowCustomerForm(false)
  }

  // Handle referral creation
  const handleReferralCreated = (referral: ReferralDTO) => {
    setReferrals(prev => [...prev, referral])
    setSelectedReferral(referral.id.toString())
    setShowReferralForm(false)
  }

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (buttonState.disabled) {
      toast({
        title: "Cannot create order",
        description: buttonState.reason || "Please complete all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!userBranch) {
      toast({
        title: "No branch assigned",
        description: "You don't have a branch assigned. Please contact your administrator.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare order items with correct structure - use DEFAULT_WIDTH instead of form width
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        length: item.typeOfProduct === "LENGTH_WIDTH" ? item.length : 1,
        width: DEFAULT_WIDTH, // Use environment variable
        discount: item.discount,
        notes: item.notes || ""
      }))

      const customerId = parseInt(selectedCustomer)
      const referralId = selectedReferral && selectedReferral !== "none" ? parseInt(selectedReferral) : undefined
      const formData = new FormData()
      
      formData.append('orderItems', JSON.stringify(orderItems))
      formData.append('notes', notes)
      
      // Add referral ID if selected and not "none"
      if (referralId) {
        formData.append('referralId', referralId.toString())
      }

      let response

      switch (orderType) {
        case "QUOTATION":
          response = await createQuotationAction(formData, customerId)
          break
        case "IMMEDIATE_SALE":
          formData.append('paymentAmount', paymentAmount)
          formData.append('paymentMethod', paymentMethod)
          response = await createImmediateSaleWithReferralAction(formData, customerId)
          break
        case "FUTURE_COLLECTION":
          formData.append('paymentAmount', paymentAmount)
          formData.append('paymentMethod', paymentMethod)
          formData.append('expectedCollectionDate', expectedCollectionDate)
          response = await createFutureCollectionWithReferralAction(formData, customerId)
          break
        case "LAYAWAY":
          formData.append('paymentAmount', layawayPlan.depositAmount.toString())
          formData.append('paymentMethod', paymentMethod)
          
          const layawayPlanData = {
            depositAmount: layawayPlan.depositAmount,
            installmentAmount: calculatedInstallmentAmount,
            numberOfInstallments: layawayPlan.numberOfInstallments,
            installmentFrequencyDays: layawayPlan.installmentFrequencyDays,
            firstInstallmentDate: layawayPlan.firstInstallmentDate
          }
          formData.append('layawayPlan', JSON.stringify(layawayPlanData))
          
          response = await createLayawayWithReferralAction(formData, customerId)
          break
        default:
          throw new Error("Invalid order type")
      }

      if (response.success) {
        toast({
          title: "Order created successfully",
          description: `${orderType.replace('_', ' ').toLowerCase()} order has been created.`,
        })
        clearCart()
        router.push(`/orders/${response.data.id}`)
      } else {
        throw new Error(response.error || "Failed to create order")
      }
    } catch (error: any) {
      toast({
        title: "Error creating order",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <main className="flex flex-1 h-full">
        {/* Products Section - Left Side */}
        <div className="flex-1 border-r flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Point of Sale</h1>
                <p className="text-muted-foreground">
                  Create orders and process transactions
                </p>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Scrollable Products */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
            <Tabs defaultValue="all" className="h-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Products</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <ProductGrid
                  products={products}
                  searchQuery={searchQuery}
                  onAddToCart={addToCart}
                  currentUserBranch={userBranch}
                />
              </TabsContent>

              {categories.map(category => (
                <TabsContent key={category.id} value={category.name.toLowerCase()} className="mt-0">
                  <ProductGrid
                    products={products.filter(p => p.productCategoryName === category.name)}
                    searchQuery={searchQuery}
                    onAddToCart={addToCart}
                    currentUserBranch={userBranch}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col h-full">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Fixed Cart Header */}
            <div className="p-4 md:p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Current Order</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Order Type Selection */}
              <div className="mb-4">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={(value: OrderType) => setOrderType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUOTATION">Quotation</SelectItem>
                    <SelectItem value="IMMEDIATE_SALE">Immediate Sale</SelectItem>
                    <SelectItem value="FUTURE_COLLECTION">Future Collection</SelectItem>
                    <SelectItem value="LAYAWAY">Layaway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Scrollable Cart Content */}
            <div className="flex-1 overflow-y-auto p-4 md:px-6">
              {/* Cart Items */}
              <Card className="mb-4">
                <CardContent className="p-4 max-h-[30vh] overflow-y-auto">
                  <CartItems
                    items={cartItems}
                    onUpdateItem={updateCartItem}
                    onRemoveItem={removeItem}
                    getLineTotal={getLineTotal}
                  />
                </CardContent>
              </Card>

              {/* Order Details Form */}
              <div className="space-y-4">
                {/* Customer Selection */}
                <div>
                  <Label>Customer *</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.firstName} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowCustomerForm(true)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Referral Selection (Optional) - Only show if cart has referable items */}
                {hasReferableItems && (
                  <div>
                    <Label>Referral (Optional)</Label>
                    <div className="flex gap-2">
                      <Select value={selectedReferral} onValueChange={setSelectedReferral}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select referral (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No referral</SelectItem>
                          {referrals.map((referral) => (
                            <SelectItem key={referral.id} value={referral.id.toString()}>
                              {referral.fullName} - {referral.phoneNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowReferralForm(true)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedReferral && selectedReferral !== "none" && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Referral commission will be calculated for eligible items
                      </div>
                    )}
                    <div className="text-xs text-blue-600 mt-1">
                      💡 Referral commissions apply to: {cartItems.filter(item => item.isReferable).map(item => item.name).join(', ')}
                    </div>
                  </div>
                )}

                {/* Layaway Configuration */}
                {orderType === "LAYAWAY" && (
                  <LayawayConfig
                    config={layawayPlan}
                    total={total}
                    calculatedInstallmentAmount={calculatedInstallmentAmount}
                    onConfigChange={setLayawayPlan}
                  />
                )}

                {/* Payment Details (for non-quotation orders) */}
                {orderType !== "QUOTATION" && (
                  <>
                    <div>
                      <Label>Payment Amount *</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Enter payment amount"
                            required
                            className="pl-8"
                            disabled={orderType === "LAYAWAY"}
                          />
                        </div>
                        {orderType !== "LAYAWAY" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPaymentAmount(total.toFixed(2))}
                                >
                                  Full
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Set to full amount (${total.toFixed(2)})</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {orderType === "LAYAWAY" && (
                        <div className="text-xs text-blue-600 mt-1">
                          Payment amount automatically set to deposit amount
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Payment Method *</Label>
                      <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="CARD">Card</SelectItem>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Collection Date (for future collection) */}
                {orderType === "FUTURE_COLLECTION" && (
                  <div>
                    <Label>Expected Collection Date *</Label>
                    <Input
                      type="date"
                      value={expectedCollectionDate}
                      onChange={(e) => setExpectedCollectionDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="mt-1"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this order"
                    rows={2}
                    className="mt-1"
                  />
                </div>

                {/* Order Summary */}
                <OrderSummary
                  subtotal={subtotal}
                  taxAmount={taxAmount}
                  total={total}
                  orderType={orderType}
                  layawayPlan={layawayPlan}
                  calculatedInstallmentAmount={calculatedInstallmentAmount}
                  paymentAmount={paymentAmount}
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-4 md:p-6 border-t mt-auto">
              <Button
                type="submit"
                className="w-full"
                disabled={buttonState.disabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    {orderType === "LAYAWAY" ? (
                      <Calendar className="mr-2 h-4 w-4" />
                    ) : orderType === "IMMEDIATE_SALE" ? (
                      <CreditCard className="mr-2 h-4 w-4" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" />
                    )}
                    Create {orderType.replace('_', ' ')}
                  </>
                )}
              </Button>
              
              {/* Show the reason why button is disabled */}
              {buttonState.disabled && buttonState.reason && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {buttonState.reason}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Customer Creation Dialog */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to the system for this order.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            onCustomerCreated={handleCustomerCreated}
            onCancel={() => setShowCustomerForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Referral Creation Dialog */}
      <Dialog open={showReferralForm} onOpenChange={setShowReferralForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Referral</DialogTitle>
            <DialogDescription>
              Add a new referral to the system. Referrals can earn commission on orders.
            </DialogDescription>
          </DialogHeader>
          <ReferralForm
            onReferralCreated={handleReferralCreated}
            onCancel={() => setShowReferralForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}