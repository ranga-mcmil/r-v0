// app/(main)/reports/components/date-range-picker.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void
  startDate?: string
  endDate?: string
}

export function DateRangePicker({ onDateChange, startDate, endDate }: DateRangePickerProps) {
  const [start, setStart] = useState<Date | undefined>(startDate ? new Date(startDate) : undefined)
  const [end, setEnd] = useState<Date | undefined>(endDate ? new Date(endDate) : undefined)

  const handleStartDateChange = (date: Date | undefined) => {
    setStart(date)
    if (date && end) {
      onDateChange(format(date, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"))
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEnd(date)
    if (start && date) {
      onDateChange(format(start, "yyyy-MM-dd"), format(date, "yyyy-MM-dd"))
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="space-y-2">
        <Label htmlFor="start-date">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="start-date"
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {start ? format(start, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={start}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="end-date"
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {end ? format(end, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={end}
              onSelect={handleEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}