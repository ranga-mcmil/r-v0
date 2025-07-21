// app/(main)/reports/date-range/components/date-range-filter.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface DateRangeFilterProps {
  currentStartDate: string
  currentEndDate: string
}

export function DateRangeFilter({ currentStartDate, currentEndDate }: DateRangeFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [startDate, setStartDate] = useState(currentStartDate)
  const [endDate, setEndDate] = useState(currentEndDate)

  const handleDateRangeChange = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date')
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    router.push(`/reports/date-range?${params.toString()}`)
  }

  const setQuickRange = (days: number) => {
    const end = new Date()
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <h3 className="font-medium">Date Range Filter</h3>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setQuickRange(7)}>
            Last 7 days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuickRange(30)}>
            Last 30 days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuickRange(90)}>
            Last 90 days
          </Button>
        </div>
        
        <Button onClick={handleDateRangeChange}>
          Apply Filter
        </Button>
      </div>
    </div>
  )
}
