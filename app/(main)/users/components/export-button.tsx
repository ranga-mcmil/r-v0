"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportUsers } from "../actions"

interface ExportButtonProps {
  search?: string
  role?: string
  status?: string
  fromDate?: string
  toDate?: string
}

export function ExportButton({ search, role, status, fromDate, toDate }: ExportButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    exportUsers({
      search,
      role,
      status,
      fromDate,
      toDate,
      format: "csv",
    })
      .then((result) => {
        if (result.success) {
          toast({
            title: "Export successful",
            description: result.message,
          })

          // In a real app, we would redirect to the download URL
          // window.location.href = result.url!
        } else {
          toast({
            title: "Export failed",
            description: result.message,
            variant: "destructive",
          })
        }
      })
      .catch((error) => {
        toast({
          title: "Export failed",
          description: "An error occurred while exporting",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  )
}
