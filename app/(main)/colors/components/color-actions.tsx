// app/(main)/colors/components/color-actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface ColorActionsProps {
  colorId: number
  colorName: string
}

export function ColorActions({ colorId }: ColorActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/colors/edit/${colorId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/colors/delete/${colorId}`}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Link>
      </Button>
    </div>
  )
}