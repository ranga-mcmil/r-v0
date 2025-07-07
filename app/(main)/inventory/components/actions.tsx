// app/(main)/inventory/components/actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, History } from "lucide-react"
import Link from "next/link"

interface ActionsProps {
  productId: number
  batchId: number
  productName: string
}

export function Actions({ productId, batchId, productName }: ActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/inventory/add?productId=${productId}&batchId=${batchId}`}>
          <Plus className="mr-2 h-4 w-4" /> Add Stock
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/inventory/adjust?productId=${productId}&batchId=${batchId}&type=increase`}>
          <TrendingUp className="mr-2 h-4 w-4" /> Increase
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/inventory/adjust?productId=${productId}&batchId=${batchId}&type=decrease`}>
          <TrendingDown className="mr-2 h-4 w-4" /> Decrease
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/inventory/history/${productId}`}>
          <History className="mr-2 h-4 w-4" /> History
        </Link>
      </Button>
    </div>
  )
}