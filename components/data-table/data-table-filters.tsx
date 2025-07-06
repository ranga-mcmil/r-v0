// components/data-table/data-table-filters.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterOption {
  value: string
  label: string
}

interface DataTableFiltersProps {
  currentSearch: string
  currentStatus: string
  statusOptions: FilterOption[]
  searchPlaceholder?: string
  statusLabel?: string
}

export function DataTableFilters({ 
  currentSearch, 
  currentStatus, 
  statusOptions,
  searchPlaceholder = "Search...",
  statusLabel = "Status"
}: DataTableFiltersProps) {
  return (
    <form method="GET" className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder={searchPlaceholder}
          className="pl-8 w-full"
          defaultValue={currentSearch}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <Select name="status" defaultValue={currentStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={statusLabel} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline">
          Apply Filters
        </Button>
      </div>
    </form>
  )
}
