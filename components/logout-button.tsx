// components/logout-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function LogoutButton() {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" /> Sign Out
    </DropdownMenuItem>
  )
}