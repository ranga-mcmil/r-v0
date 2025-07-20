// app/(main)/orders/components/actions.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Edit, 
  CreditCard, 
  CheckCircle, 
  Package, 
  RotateCcw, 
  FileText, 
  MoreHorizontal,
  ArrowRight,
  Printer
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { 
  markReadyForCollectionAction, 
  completeCollectionAction,
  getOrderAction
} from "@/actions/orders"

interface ActionsProps {
  orderId: number
  orderType: string
  status: string
  orderNumber: string
}

export function Actions({ orderId, orderType, status, orderNumber }: ActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleMarkReady = async () => {
    setIsProcessing(true)
    
    try {
      const result = await markReadyForCollectionAction(orderId)
      
      if (result.success) {
        toast({
          title: "Order marked ready",
          description: "Order has been marked ready for collection",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark order ready",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Mark ready error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCompleteCollection = async () => {
    setIsProcessing(true)
    
    try {
      const result = await completeCollectionAction(orderId)
      
      if (result.success) {
        toast({
          title: "Collection completed",
          description: "Order collection has been completed",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to complete collection",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Complete collection error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintReceipt = async () => {
    setIsProcessing(true)
    
    try {
      // Fetch the complete order data
      const orderResponse = await getOrderAction(orderId)
      
      if (!orderResponse.success || !orderResponse.data) {
        toast({
          title: "Error",
          description: "Failed to load order data for printing",
          variant: "destructive",
        })
        return
      }

      const order = orderResponse.data
      
      // Generate and print the receipt
      generateReceipt(order)
      
      toast({
        title: "Receipt opened",
        description: "Receipt opened in new tab. You can print or save as PDF.",
      })
    } catch (error) {
      console.error("Print receipt error:", error)
      toast({
        title: "Error",
        description: "Failed to print receipt",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateReceipt = (order: any) => {
    const receiptWindow = window.open('', '_blank')
    
    if (!receiptWindow) {
      toast({
        title: "Error",
        description: "Unable to open receipt window. Please check popup settings.",
        variant: "destructive",
      })
      return
    }

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Receipt #${order.orderNumber}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.4;
            background: white;
            color: black;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .receipt-container {
            background: white;
            border: 1px solid #ddd;
            padding: 20px;
            margin: 20px 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .receipt-meta {
            font-size: 11px;
            margin-bottom: 10px;
          }
          
          .logo-section {
            margin: 15px 0;
          }
          
          .logo-ascii {
            font-family: monospace;
            font-size: 6px;
            line-height: 0.8;
            margin: 10px 0;
          }
          
          .company-name {
            font-size: 18px;
            font-weight: bold;
            margin: 8px 0;
          }
          
          .tagline {
            font-size: 10px;
            margin: 5px 0;
          }
          
          .company-info {
            font-size: 10px;
            margin: 2px 0;
          }
          
          .customer-section {
            margin: 20px 0;
            text-align: left;
          }
          
          .customer-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .customer-details {
            margin-left: 20px;
            margin-bottom: 10px;
          }
          
          .items-section {
            margin: 20px 0;
          }
          
          .items-header {
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 8px 0;
            font-weight: bold;
            display: grid;
            grid-template-columns: 2fr 40px 60px 70px;
            gap: 5px;
          }
          
          .item-row {
            padding: 4px 0;
            display: grid;
            grid-template-columns: 2fr 40px 60px 70px;
            gap: 5px;
            align-items: start;
          }
          
          .item-name {
            font-size: 12px;
          }
          
          .item-details {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
          }
          
          .item-qty, .item-price, .item-total {
            text-align: right;
            font-size: 12px;
          }
          
          .totals-section {
            border-top: 1px dashed #000;
            margin-top: 15px;
            padding-top: 10px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 12px;
          }
          
          .final-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #000;
            padding-top: 8px;
            margin-top: 8px;
          }
          
          .payment-section {
            margin: 15px 0;
          }
          
          .footer {
            text-align: center;
            margin-top: 25px;
            border-top: 1px dashed #000;
            padding-top: 15px;
          }
          
          .barcode {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            letter-spacing: 2px;
            margin: 15px 0;
          }
          
          .print-controls {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          
          .print-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
            font-size: 12px;
          }
          
          .print-btn:hover {
            background: #0056b3;
          }
          
          @media print {
            .print-controls {
              display: none;
            }
            
            body {
              padding: 0;
              margin: 0;
              max-width: none;
            }
            
            .receipt-container {
              border: none;
              margin: 0;
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-controls">
          <button class="print-btn" onclick="window.print()">🖨️ Print</button>
          <button class="print-btn" onclick="downloadPDF()">📄 Save PDF</button>
          <button class="print-btn" onclick="window.close()" style="background: #6c757d;">✕ Close</button>
        </div>

        <div class="receipt-container">
          <div class="header">
            <div class="receipt-meta">
              <div>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
              <div>Store ${order.branchName || 'KK'}</div>
              <div>${order.branchName || 'KK'} Sales Receipt #${order.orderNumber.replace(/[^0-9]/g, '')}</div>
              <div>Workstation 1</div>
            </div>
            
            <div class="logo-section">
              <div class="logo-ascii">
<pre>    ████████████████████████</pre>
<pre>   ██████████████████████████</pre>
<pre>  ████████████████████████████</pre>
<pre> ██████████████████████████████</pre>
<pre>████████████████████████████████</pre>
              </div>
              
              <div class="company-name">ROOFSTAR INDUSTRIES</div>
              <div class="tagline">――――― Experts In Roofing ―――――</div>
              
              <div class="company-info">2806 Edison Street</div>
              <div class="company-info">Kwekwe Zimbabwe</div>
              <div class="company-info">+263 55 2526504-5/0778922333/0775926066</div>
              <div class="company-info">roofstarind@gmail.com</div>
              <div class="company-info">Experts In Roofing</div>
            </div>
          </div>

          <div class="customer-section">
            <div class="customer-label">Bill To:</div>
            <div class="customer-details">
              <div>${order.customerName}</div>
              <div>${order.branchName}</div>
            </div>
            <div>Cashier: ${order.payments?.[0]?.receivedBy || 'System'}</div>
          </div>

          <div class="items-section">
            <div class="items-header">
              <div>Item Name</div>
              <div>Qty</div>
              <div>Price</div>
              <div>Ext Price</div>
            </div>

            ${order.orderItems?.map((item: any) => `
              <div class="item-row">
                <div>
                  <div class="item-name">${item.productName}</div>
                  ${item.length ? `<div class="item-details">${item.length}m</div>` : ''}
                </div>
                <div class="item-qty">${item.quantity}</div>
                <div class="item-price">${item.unitPrice.toFixed(2)}</div>
                <div class="item-total">${item.totalPrice.toFixed(2)}</div>
              </div>
            `).join('') || ''}
          </div>

          <div class="totals-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${(order.totalAmount / 1.15).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>0% Disc:</span>
              <span>-$0.00</span>
            </div>
            <div class="total-row">
              <span>Local Sales Tax 0% Tax:</span>
              <span>+$0.00</span>
            </div>
            <div class="total-row final-total">
              <span><strong>RECEIPT TOTAL:</strong></span>
              <span><strong>${order.totalAmount.toFixed(2)}</strong></span>
            </div>
          </div>

          <div class="payment-section">
            <div>Cash: ${order.paidAmount.toFixed(2)}</div>
          </div>

          <div class="footer">
            <div>Thanks for shopping with us!</div>
            <div class="barcode">|||||| |||| ||| || |||||| ||</div>
            <div style="font-size: 10px;">${order.orderNumber.replace(/[^0-9]/g, '')}</div>
          </div>
        </div>

        <script>
          function downloadPDF() {
            // Hide the controls temporarily
            const controls = document.querySelector('.print-controls');
            controls.style.display = 'none';
            
            // Use browser's print to PDF functionality
            window.print();
            
            // Show controls again after a delay
            setTimeout(() => {
              controls.style.display = 'block';
            }, 1000);
          }
          
          // Auto-focus on the window for better UX
          window.focus();
        </script>
      </body>
      </html>
    `

    receiptWindow.document.write(receiptHTML)
    receiptWindow.document.close()
  }

  const canConvert = orderType === 'QUOTATION' && status === 'PENDING'
  const canMarkReady = ['CONFIRMED', 'FULLY_PAID'].includes(status) && orderType !== 'IMMEDIATE_SALE'
  const canCompleteCollection = status === 'READY_FOR_COLLECTION'
  const canMakePayment = orderType === 'LAYAWAY' && ['CONFIRMED', 'PARTIALLY_PAID'].includes(status)
  const canReverse = !['COMPLETED', 'CANCELLED', 'REVERSED'].includes(status)
  const canPrintReceipt = status === 'COMPLETED' // Only show print for completed orders

  return (
    <div className="flex gap-2">
      {/* Quick Actions */}
      {canMarkReady && (
        <Button 
          variant="outline" 
          onClick={handleMarkReady}
          disabled={isProcessing}
        >
          <Package className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Mark Ready"}
        </Button>
      )}

      {canCompleteCollection && (
        <Button 
          onClick={handleCompleteCollection}
          disabled={isProcessing}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Complete Collection"}
        </Button>
      )}

      {canMakePayment && (
        <Button variant="outline" asChild>
          <Link href={`/orders/${orderId}/payment`}>
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Link>
        </Button>
      )}

      {/* Print Receipt Button - Only for completed orders */}
      {canPrintReceipt && (
        <Button 
          variant="outline" 
          onClick={handlePrintReceipt}
          disabled={isProcessing}
        >
          <Printer className="mr-2 h-4 w-4" />
          {isProcessing ? "Printing..." : "Print Receipt"}
        </Button>
      )}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {canConvert && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/convert?type=IMMEDIATE_SALE`}>
                  <ArrowRight className="mr-2 h-4 w-4 text-green-600" />
                  Convert to Sale
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/convert?type=LAYAWAY`}>
                  <ArrowRight className="mr-2 h-4 w-4 text-orange-600" />
                  Convert to Layaway
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/convert?type=FUTURE_COLLECTION`}>
                  <ArrowRight className="mr-2 h-4 w-4 text-purple-600" />
                  Convert to Future Collection
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/orders/${orderId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Link>
          </DropdownMenuItem>

          {orderType === 'LAYAWAY' && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/layaway-summary`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Layaway Summary
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/payments`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment History
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/stock-movements?orderNumber=${orderNumber}`}>
              <Package className="mr-2 h-4 w-4" />
              View Stock Movements
            </Link>
          </DropdownMenuItem>

          {canReverse && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/orders/${orderId}/reverse`}>
                  <RotateCcw className="mr-2 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Reverse Order</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}