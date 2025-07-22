// app/(main)/orders/[id]/print/components/printable-order.tsx
"use client"

import { useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import type { OrderResponseDTO } from "@/lib/http-service/orders/types"

interface PrintableOrderProps {
  order: OrderResponseDTO
}

export function PrintableOrder({ order }: PrintableOrderProps) {
  useEffect(() => {
    // Auto-print when the component loads
    window.print()
  }, [])

  const formatOrderType = (orderType: string) => {
    return orderType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-2">COMPANY NAME</h1>
        <p className="text-gray-600">123 Business Street, City, State 12345</p>
        <p className="text-gray-600">Phone: (555) 123-4567 | Email: info@company.com</p>
      </div>

      {/* Order Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">{formatOrderType(order.orderType)}</h2>
            <div className="space-y-1">
              <p><strong>Order Number:</strong> {order.orderNumber}</p>
              <p><strong>Date:</strong> {new Date(order.createdDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {formatStatus(order.status)}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold mb-2">Bill To:</h3>
            <div>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-gray-600">Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold mb-2">Order Information</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Branch:</strong> {order.branchName}</p>
            {order.referralName && (
              <p><strong>Referred by:</strong> {order.referralName}</p>
            )}
            {order.expectedCollectionDate && (
              <p><strong>Expected Collection:</strong> {new Date(order.expectedCollectionDate).toLocaleDateString()}</p>
            )}
            {order.completionDate && (
              <p><strong>Completed:</strong> {new Date(order.completionDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Payment Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="text-green-600">{formatCurrency(order.paidAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Balance Due:</span>
              <span className={order.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                {formatCurrency(order.balanceAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h4 className="font-semibold mb-4">Order Items</h4>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Product</th>
              <th className="border border-gray-300 p-2 text-center">Qty</th>
              <th className="border border-gray-300 p-2 text-center">Dimensions</th>
              <th className="border border-gray-300 p-2 text-right">Unit Price</th>
              <th className="border border-gray-300 p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-600">Code: {item.productCode}</div>
                    {item.notes && (
                      <div className="text-xs text-gray-500 italic">{item.notes}</div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {item.length > 0 && item.width > 0 ? (
                    `${item.length}m × ${item.width}m`
                  ) : (
                    '-'
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="border border-gray-300 p-2 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={4} className="border border-gray-300 p-2 text-right font-semibold">
                Total:
              </td>
              <td className="border border-gray-300 p-2 text-right font-bold">
                {formatCurrency(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment History */}
      {order.payments && order.payments.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-4">Payment History</h4>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-left">Method</th>
                <th className="border border-gray-300 p-2 text-left">Reference</th>
                <th className="border border-gray-300 p-2 text-right">Amount</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {order.payments
                .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
                .map((payment, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">{payment.paymentMethod}</td>
                  <td className="border border-gray-300 p-2">{payment.paymentReference || '-'}</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {payment.reversed ? (
                      <span className="text-red-600">-{formatCurrency(payment.amount)}</span>
                    ) : (
                      <span className="text-green-600">{formatCurrency(payment.amount)}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {payment.reversed ? (
                      <span className="text-red-600">Reversed</span>
                    ) : (
                      <span className="text-green-600">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Notes</h4>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm">{order.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Terms & Conditions</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Payment is due upon completion of order</p>
              <p>• Layaway orders must be collected within 30 days of final payment</p>
              <p>• All sales are final unless otherwise specified</p>
              <p>• Company warranty applies as per standard terms</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">
              <p>Printed on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              <p>Document ID: {order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}