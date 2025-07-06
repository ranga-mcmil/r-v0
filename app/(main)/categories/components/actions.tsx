// app/(main)/categories/components/actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface ActionsProps {
  categoryId: number
  categoryName: string
}

export function Actions({ categoryId }: ActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/categories/edit/${categoryId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/categories/delete/${categoryId}`}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Link>
      </Button>
    </div>
  )
}