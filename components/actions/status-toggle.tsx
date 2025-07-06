// components/actions/status-toggle.tsx
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import Link from "next/link"

interface StatusToggleProps {
  itemId: string
  currentStatus: string
  baseUrl: string // e.g., "/warehouses", "/users"
  activeStatus?: string
  inactiveStatus?: string
}

export function StatusToggle({ 
  itemId, 
  currentStatus, 
  baseUrl,
  activeStatus = "active",
  inactiveStatus = "inactive"
}: StatusToggleProps) {
  const action = currentStatus === activeStatus ? "deactivate" : "activate"
  
  return (
    <Button asChild>
      <Link href={`${baseUrl}/status/${itemId}?action=${action}`}>
        <RefreshCw className="mr-2 h-4 w-4" />
        {currentStatus === activeStatus ? "Deactivate" : "Activate"}
      </Link>
    </Button>
  )
}