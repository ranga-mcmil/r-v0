// app/(main)/reports/sales-detail/components/sales-detail-client.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Download, FileText } from "lucide-react"
import { ReportExportButton } from "../../components/export-button"
import { SalesDetailTable } from "./sales-detail-table"
import { getSalesDetailReportAction, getSalesDetailReportByDateRangeAction } from "@/actions/reports"
import type { SalesDetailReportResponse } from "@/lib/http-service/reports/types"

export function SalesDetailReportClient() {
  const [reportData, setReportData] = useState<SalesDetailReportResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reportType, setReportType] = useState<'single' | 'range'>('single')
  const { toast } = useToast()

  const generateSingleDateReport = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const date = formData.get('date') as string
      const result = await getSalesDetailReportAction(date)
      
      if (result.success && result.data) {
        setReportData(result.data)
        toast({
          title: "Report generated",
          description: `Sales detail report for ${date} generated successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate report",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateDateRangeReport = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const startDate = formData.get('startDate') as string
      const endDate = formData.get('endDate') as string
      
      if (!startDate || !endDate) {
        toast({
          title: "Error",
          description: "Please select both start and end dates",
          variant: "destructive",
        })
        return
      }
      
      const result = await getSalesDetailReportByDateRangeAction(startDate, endDate)
      
      if (result.success && result.data) {
        setReportData(result.data)
        toast({
          title: "Report generated",
          description: `Sales detail report from ${startDate} to ${endDate} generated successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate report",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={reportType === 'single' ? 'default' : 'outline'}
          onClick={() => setReportType('single')}
        >
          Single Date
        </Button>
        <Button
          variant={reportType === 'range' ? 'default' : 'outline'}
          onClick={() => setReportType('range')}
        >
          Date Range
        </Button>
      </div>

      {reportType === 'single' ? (
        <form action={generateSingleDateReport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              className="w-[200px]"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      ) : (
        <form action={generateDateRangeReport} className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                className="w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="w-[200px]"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              <FileText className="mr-2 h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </form>
      )}

      {reportData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Report Results ({reportData.length} records)</h3>
            <ReportExportButton 
              data={reportData} 
              filename="sales_detail_report" 
            />
          </div>
          <SalesDetailTable data={reportData} />
        </div>
      )}
    </div>
  )
}