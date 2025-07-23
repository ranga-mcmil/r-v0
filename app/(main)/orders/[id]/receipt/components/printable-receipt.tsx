// app/(main)/orders/[id]/receipt/components/printable-receipt.tsx
"use client"

import { useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import type { OrderResponseDTO } from "@/lib/http-service/orders/types"

interface PrintableReceiptProps {
  order: OrderResponseDTO
}

export function PrintableReceipt({ order }: PrintableReceiptProps) {
  useEffect(() => {
    // Auto-print when the component loads
    window.print()
  }, [])

  const formatOrderType = (orderType: string) => {
    return orderType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  // Get the latest payment for receipt details
  const latestPayment = order.payments && order.payments.length > 0 
    ? order.payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]
    : null

  return (
    <div className="max-w-md mx-auto p-4 bg-white text-black" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
      {/* Header */}
      <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-4">
        <div className="text-lg font-bold">ROOFSTAR INDUSTRIES</div>
        <div className="text-xs">2806 Edson Street</div>
        <div className="text-xs">Light Industry, Kwekwe, Zimbabwe</div>
        <div className="text-xs">Phone: 077 692 2333</div>
        <div className="text-xs">Email: roofstarsales@gmail.com</div>
        <div className="text-xs">www.roofstar.co.zw</div>
        <div className="text-xs mt-2 font-bold">TAX INVOICE / RECEIPT</div>
      </div>

      {/* Receipt Details */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span>{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Order Date:</span>
          <span>{new Date(order.createdDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span>{formatOrderType(order.orderType)}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span>{order.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Branch:</span>
          <span>{order.branchName}</span>
        </div>
        {order.referralName && (
          <div className="flex justify-between">
            <span>Referral:</span>
            <span>{order.referralName}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
        <div className="font-bold mb-2">ITEMS:</div>
        {order.orderItems.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between">
              <span className="flex-1">{item.productName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Code: {item.productCode}</span>
            </div>
            <div className="flex justify-between">
              <span>{item.quantity} × {formatCurrency(item.unitPrice)}</span>
              <span>{formatCurrency(item.totalPrice)}</span>
            </div>
            {item.length > 0 && (
              <div className="text-xs text-gray-600">
                Length: {item.length}m
              </div>
            )}
            {item.notes && (
              <div className="text-xs text-gray-600 italic">
                Note: {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (0%):</span>
          <span>{formatCurrency(0)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-gray-400 pt-1">
          <span>TOTAL:</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {/* Payment Information */}
      <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
        <div className="font-bold mb-2">PAYMENT:</div>
        <div className="flex justify-between">
          <span>Amount Paid:</span>
          <span>{formatCurrency(order.paidAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance Due:</span>
          <span>{formatCurrency(order.balanceAmount)}</span>
        </div>
        {latestPayment && (
          <>
            <div className="flex justify-between mt-2">
              <span>Payment Method:</span>
              <span>{latestPayment.paymentMethod}</span>
            </div>
            {latestPayment.paymentReference && (
              <div className="flex justify-between">
                <span>Reference:</span>
                <span>{latestPayment.paymentReference}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Received By:</span>
              <span>{latestPayment.receivedBy}</span>
            </div>
          </>
        )}
      </div>

      {/* Payment Status */}
      <div className="text-center mb-4">
        {order.balanceAmount <= 0 ? (
          <div className="font-bold">*** PAID IN FULL ***</div>
        ) : order.orderType === 'LAYAWAY' ? (
          <div>
            <div className="font-bold">*** LAYAWAY ORDER ***</div>
            <div className="text-xs mt-1">
              Balance: {formatCurrency(order.balanceAmount)}
            </div>
            <div className="text-xs">
              Please keep this receipt for payment tracking
            </div>
          </div>
        ) : (
          <div>
            <div className="font-bold">*** PARTIAL PAYMENT ***</div>
            <div className="text-xs mt-1">
              Remaining: {formatCurrency(order.balanceAmount)}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs border-t border-dashed border-gray-400 pt-2">
        <div className="mb-1">Thank you for your business!</div>
        {order.orderType === 'LAYAWAY' && order.balanceAmount > 0 && (
          <div className="mb-1">Next payment helps complete your order</div>
        )}
        {order.orderType === 'FUTURE_COLLECTION' && order.balanceAmount <= 0 && (
          <div className="mb-1">Order ready for collection</div>
        )}
        <div className="text-xs mt-2">
          Visit us: www.roofstar.co.zw
        </div>
        <div className="text-xs">
          Email: roofstarsales@gmail.com
        </div>
        
        {/* QR Code placeholder */}
        <div className="mt-3 flex justify-center">
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs">
            QR Code
          </div>
        </div>
        <div className="text-xs mt-1">
          Scan for order details
        </div>
      </div>

      {/* Print info */}
      <div className="text-center text-xs mt-4 border-t border-gray-400 pt-2">
        <div>Receipt printed: {new Date().toLocaleString()}</div>
        <div>Order ID: {order.orderNumber}</div>
      </div>
    </div>
  )
}