// app/(main)/thicknesses/components/actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface ActionsProps {
  thicknessId: number
  thicknessValue: number
}

export function Actions({ thicknessId }: ActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/thicknesses/edit/${thicknessId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/thicknesses/delete/${thicknessId}`}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Link>
      </Button>
    </div>
  )
}