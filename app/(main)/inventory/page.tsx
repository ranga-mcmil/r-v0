"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ArrowDownUp, Package, Search } from "lucide-react"
import { InventoryTable } from "@/components/inventory-table"
import { InventoryMovements } from "@/components/inventory-movements"
import Link from "next/link"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { Pagination } from "@/components/ui/pagination"

export default function InventoryPage() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [activeTab, setActiveTab] = useState("stock")

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Reset to first page when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage your IBR roofing sheet inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <ArrowDownUp className="mr-2 h-4 w-4" /> Stock Movement
            </Button>
            <Button asChild>
              <Link href="/inventory/add">
                <Package className="mr-2 h-4 w-4" /> Restock
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
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">3 categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,350</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">3</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">0</div>
                <p className="text-xs text-muted-foreground">All items in stock</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="border rounded-lg p-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search inventory..." className="pl-8 w-full" />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
          <Tabs defaultValue="stock" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="stock">Current Stock</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            </TabsList>
            <TabsContent value="stock">
              {loading ? (
                <TableSkeleton columnCount={8} rowCount={5} />
              ) : (
                <>
                  <InventoryTable page={currentPage} itemsPerPage={itemsPerPage} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(9 / itemsPerPage)} // 9 inventory items
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </TabsContent>
            <TabsContent value="movements">
              {loading ? (
                <TableSkeleton columnCount={6} rowCount={5} />
              ) : (
                <>
                  <InventoryMovements page={currentPage} itemsPerPage={itemsPerPage} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(10 / itemsPerPage)} // 10 movement records
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
