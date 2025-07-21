// app/(main)/reports/components/date-filter.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface DateFilterProps {
  currentDate: string
}

export function DateFilter({ currentDate }: DateFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(currentDate)

  const handleDateChange = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', selectedDate)
    params.set('pageNo', '0') // Reset to first page
    router.push(`/reports?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <Label htmlFor="report-date">Report Date:</Label>
      </div>
      <Input
        id="report-date"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-auto"
      />
      <Button onClick={handleDateChange} variant="outline">
        Apply Filter
      </Button>
    </div>
  )
}