// app/(main)/users/components/actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserX, UserCheck } from "lucide-react"
import Link from "next/link"

interface ActionsProps {
  userId: string
  userName: string
}

export function Actions({ userId }: ActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/users/edit/${userId}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/users/toggle-status/${userId}`}>
          <UserX className="mr-2 h-4 w-4" /> Toggle Status
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/users/reset-password/${userId}`}>
          <UserCheck className="mr-2 h-4 w-4" /> Reset Password
        </Link>
      </Button>
    </div>
  )
}