"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonProps {
  data: any[]
  filename: string
  headers: string[]
  className?: string
}

export function ExportButton({ data, filename, headers, className }: ExportButtonProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const exportCSV = () => {
    setIsExporting(true)

    try {
      // Create CSV content - convert objects to arrays of values
      const rows = data.map((item) => {
        // Extract values in the same order as headers
        return Object.values(item).map(value => String(value || ''))
      })
      
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `${data.length} items exported to CSV`,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while exporting",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" onClick={exportCSV} disabled={isExporting} className={className}>
      <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  )
}