// app/(main)/referral-payments/components/status-filter.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import type { ReferralPaymentStatus } from "@/lib/http-service/referral-payments/types"

interface StatusFilterProps {
  onStatusFilter: (status: ReferralPaymentStatus | 'ALL') => void
  currentFilter: ReferralPaymentStatus | 'ALL'
}

export function StatusFilter({ onStatusFilter, currentFilter }: StatusFilterProps) {
  const statuses: Array<{ key: ReferralPaymentStatus | 'ALL', label: string, color: string }> = [
    { key: 'ALL', label: 'All', color: 'bg-gray-100 text-gray-800' },
    { key: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'APPROVED', label: 'Approved', color: 'bg-blue-100 text-blue-800' },
    { key: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { key: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { key: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status.key}
          variant={currentFilter === status.key ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilter(status.key)}
        >
          <Badge className={status.color} variant="outline">
            {status.label}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
