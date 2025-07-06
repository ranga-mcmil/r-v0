"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Edit, FileText, Plus, Printer, RefreshCw, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Invoice } from "@/lib/types"
import { DateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initializeDummyData } from "@/lib/dummy-data"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function InvoicesPage() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData()

    // Simulate loading delay
    const timer = setTimeout(() => {
      // Load invoices data
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]
      setInvoices(savedInvoices)
      setFilteredInvoices(savedInvoices)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Apply filters and sort
  useEffect(() => {
    if (loading) return

    let result = [...invoices]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.customerName.toLowerCase().includes(query) ||
          invoice.id.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((invoice) => invoice.status === statusFilter)
    }

    // Apply date range filter
    if (dateRange.from) {
      result = result.filter((invoice) => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate >= dateRange.from!
      })
    }

    if (dateRange.to) {
      result = result.filter((invoice) => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate <= dateRange.to!
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "invoiceNumber":
          aValue = a.invoiceNumber
          bValue = b.invoiceNumber
          break
        case "dueDate":
          aValue = new Date(a.dueDate).getTime()
          bValue = new Date(b.dueDate).getTime()
          break
        case "customerName":
          aValue = a.customerName
          bValue = b.customerName
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "total":
          aValue = a.total
          bValue = b.total
          break
        case "date":
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    setFilteredInvoices(result)
    // Reset to first page when filters change
    setCurrentPage(1)

    // Reset selected invoices when filters change
    setSelectedInvoices([])
    setSelectAll(false)
  }, [invoices, searchQuery, statusFilter, dateRange, sortField, sortDirection, loading])

  // Handle toggling sort
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Calculate totals
  const totalInvoices = filteredInvoices.length
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const unpaidAmount = filteredInvoices
    .filter((invoice) => invoice.status === "unpaid" || invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.total, 0)

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex)

  // Export invoices data as CSV
  const exportInvoicesCSV = () => {
    setIsExporting(true)

    try {
      // Create CSV content
      const headers = ["Invoice #", "Date", "Due Date", "Customer", "Status", "Total"]
      const rows = filteredInvoices.map((invoice) => [
        invoice.invoiceNumber,
        new Date(invoice.date).toLocaleDateString(),
        new Date(invoice.dueDate).toLocaleDateString(),
        invoice.customerName,
        invoice.status,
        `$${invoice.total.toFixed(2)}`,
      ])

      // Combine headers and rows
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `invoices_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `${filteredInvoices.length} invoices exported to CSV`,
      })
    } catch (error) {
      console.error("Error exporting invoices data:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while exporting",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Handle item selection
  const toggleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices((prev) => {
      if (prev.includes(invoiceId)) {
        return prev.filter((id) => id !== invoiceId)
      } else {
        return [...prev, invoiceId]
      }
    })
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(paginatedInvoices.map((invoice) => invoice.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle delete invoice
  const confirmDelete = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId)
    setShowDeleteDialog(true)
  }

  const deleteInvoice = () => {
    if (!invoiceToDelete) return

    try {
      const updatedInvoices = invoices.filter((invoice) => invoice.id !== invoiceToDelete)
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      setInvoices(updatedInvoices)
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted",
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting the invoice",
        variant: "destructive",
      })
    } finally {
      setInvoiceToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "No invoices selected",
        description: "Please select at least one invoice",
      })
      return
    }

    setBulkAction("")
    setShowBulkActionDialog(true)
  }

  const executeBulkAction = () => {
    if (!bulkAction || selectedInvoices.length === 0) return

    try {
      let updatedInvoices = [...invoices]

      switch (bulkAction) {
        case "mark-paid":
          updatedInvoices = invoices.map((invoice) =>
            selectedInvoices.includes(invoice.id)
              ? { ...invoice, status: "paid", paymentDate: new Date().toISOString() }
              : invoice,
          )
          break
        case "mark-unpaid":
          updatedInvoices = invoices.map((invoice) =>
            selectedInvoices.includes(invoice.id) ? { ...invoice, status: "unpaid", paymentDate: undefined } : invoice,
          )
          break
        case "delete":
          updatedInvoices = invoices.filter((invoice) => !selectedInvoices.includes(invoice.id))
          break
        default:
          throw new Error("Invalid action")
      }

      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      setInvoices(updatedInvoices)

      toast({
        title: "Bulk action completed",
        description: `Action applied to ${selectedInvoices.length} invoices`,
      })

      setSelectedInvoices([])
      setSelectAll(false)
    } catch (error) {
      toast({
        title: "Action failed",
        description: "An error occurred while processing the action",
        variant: "destructive",
      })
    } finally {
      setShowBulkActionDialog(false)
      setBulkAction("")
    }
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "unpaid":
        return <Badge variant="outline">Unpaid</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Handle mark as paid
  const markAsPaid = (invoiceId: string) => {
    try {
      const updatedInvoices = invoices.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "paid", paymentDate: new Date().toISOString() } : invoice,
      )
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      setInvoices(updatedInvoices)
      toast({
        title: "Invoice updated",
        description: "The invoice has been marked as paid",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating the invoice",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Manage and track customer invoices</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportInvoicesCSV} disabled={isExporting || loading}>
              <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button asChild>
              <Link href="/invoices/create">
                <Plus className="mr-2 h-4 w-4" /> New Invoice
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <StatsCardSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInvoices}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredInvoices.length === invoices.length
                    ? "All invoices"
                    : `Filtered from ${invoices.length} total`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">For selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${unpaidAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Outstanding balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredInvoices.filter((invoice) => invoice.status === "overdue").length}
                </div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="border rounded-lg p-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-[300px]" />
                  <Skeleton className="h-10 w-[180px]" />
                </>
              ) : (
                <>
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>

          {/* Bulk actions bar */}
          {selectedInvoices.length > 0 && (
            <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">{selectedInvoices.length}</span> invoices selected
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedInvoices([])}>
                  Clear Selection
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">Bulk Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setBulkAction("mark-paid")
                        handleBulkAction()
                      }}
                    >
                      Mark as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setBulkAction("mark-unpaid")
                        handleBulkAction()
                      }}
                    >
                      Mark as Unpaid
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setBulkAction("delete")
                        handleBulkAction()
                      }}
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {loading ? (
            <TableSkeleton columnCount={8} rowCount={10} />
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("invoiceNumber")}>
                        <div className="flex items-center">
                          Invoice #
                          {sortField === "invoiceNumber" && (
                            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("date")}>
                        <div className="flex items-center">
                          Date
                          {sortField === "date" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("dueDate")}>
                        <div className="flex items-center">
                          Due Date
                          {sortField === "dueDate" && (
                            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("customerName")}>
                        <div className="flex items-center">
                          Customer
                          {sortField === "customerName" && (
                            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                        <div className="flex items-center">
                          Status
                          {sortField === "status" && (
                            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("total")}>
                        <div className="flex items-center justify-end">
                          Total
                          {sortField === "total" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No invoices found.{" "}
                          {invoices.length > 0 ? "Try adjusting your filters." : "Create your first invoice."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={() => toggleSelectInvoice(invoice.id)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{invoice.customerName}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right font-medium">${invoice.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <span className="sr-only">Open menu</span>
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/invoices/${invoice.id}`}>
                                    <FileText className="mr-2 h-4 w-4" /> View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/invoices/edit/${invoice.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                {invoice.status !== "paid" && (
                                  <DropdownMenuItem onClick={() => markAsPaid(invoice.id)}>
                                    <FileText className="mr-2 h-4 w-4" /> Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                  <Link href={`/invoices/print/${invoice.id}`} target="_blank">
                                    <Printer className="mr-2 h-4 w-4" /> Print
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(invoice.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredInvoices.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of{" "}
                    {filteredInvoices.length} invoices
                  </p>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteInvoice} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk action confirmation dialog */}
      <AlertDialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === "delete"
                ? `This will delete ${selectedInvoices.length} invoices. This action cannot be undone.`
                : bulkAction === "mark-paid"
                  ? `This will mark ${selectedInvoices.length} invoices as paid.`
                  : bulkAction === "mark-unpaid"
                    ? `This will mark ${selectedInvoices.length} invoices as unpaid.`
                    : "Are you sure you want to perform this action?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              className={bulkAction === "delete" ? "bg-destructive text-destructive-foreground" : ""}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
