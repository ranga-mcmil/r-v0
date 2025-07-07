// app/(main)/customers/components/actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface ActionsProps {
  customerId: number
  customerName: string
}

export function Actions({ customerId }: ActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/customers/edit/${customerId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/customers/delete/${customerId}`}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Link>
      </Button>
    </div>
  )
}
