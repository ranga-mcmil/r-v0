"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Users } from "lucide-react"
import { ReferrersTable } from "@/components/referrers-table"
import { ReferrerActivity } from "@/components/referrer-activity"
import Link from "next/link"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { StatsCardSkeleton } from "@/components/skeletons/card-skeleton"
import { Pagination } from "@/components/ui/pagination"

export default function ReferrersPage() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [activeTab, setActiveTab] = useState("all")

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
            <h1 className="text-2xl font-bold">Referrers</h1>
            <p className="text-muted-foreground">Manage your referrer relationships</p>
          </div>
          <Button asChild>
            <Link href="/referrers/add">
              <Plus className="mr-2 h-4 w-4" /> Add Referrer
            </Link>
          </Button>
        </div>

        {loading ? (
          <StatsCardSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">+12 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Referrers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-xs text-muted-foreground">75% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,245</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Repeat Referrers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="border rounded-lg p-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search referrers..." className="pl-8 w-full" />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All Referrers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {loading ? (
                <TableSkeleton columnCount={6} rowCount={5} />
              ) : (
                <>
                  <ReferrersTable page={currentPage} itemsPerPage={itemsPerPage} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(8 / itemsPerPage)} // 8 total referrers
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </TabsContent>
            <TabsContent value="active">
              {loading ? (
                <TableSkeleton columnCount={6} rowCount={5} />
              ) : (
                <>
                  <ReferrersTable status="active" page={currentPage} itemsPerPage={itemsPerPage} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(6 / itemsPerPage)} // 6 active referrers
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </TabsContent>
            <TabsContent value="inactive">
              {loading ? (
                <TableSkeleton columnCount={6} rowCount={5} />
              ) : (
                <>
                  <ReferrersTable status="inactive" page={currentPage} itemsPerPage={itemsPerPage} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(2 / itemsPerPage)} // 2 inactive referrers
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </TabsContent>
            <TabsContent value="activity">
              {loading ? (
                <TableSkeleton columnCount={5} rowCount={5} />
              ) : (
                <>
                  <ReferrerActivity page={currentPage} itemsPerPage={itemsPerPage} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(10 / itemsPerPage)} // 10 activity records
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
