
// app/(main)/warehouses/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWarehouseById, getAssignedUsers } from "../actions"
import { WarehouseActions } from "../components/warehouse-actions"
import { StatusChangeButton } from "../components/status-change-button"

interface WarehouseDetailsPageProps {
  params: {
    id: string
  }
}

export default async function WarehouseDetailsPage({ params }: WarehouseDetailsPageProps) {
  const warehouseId = params.id

  // Fetch data server-side
  const [warehouse, assignedUsers] = await Promise.all([
    getWarehouseById(warehouseId),
    getAssignedUsers(warehouseId)
  ])

  if (!warehouse) {
    notFound()
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/warehouses">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{warehouse.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{warehouse.location}</span>
                <span>•</span>
                {getStatusBadge(warehouse.status)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <WarehouseActions warehouseId={warehouse.id} warehouseName={warehouse.name} />
            <StatusChangeButton
              warehouseId={warehouse.id}
              currentStatus={warehouse.status as "active" | "inactive"}
              warehouseName={warehouse.name}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Warehouse Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h3 className="font-bold">{warehouse.name}</h3>
                <div className="text-sm">{warehouse.location}</div>
                <div className="text-sm text-muted-foreground">Status: {warehouse.status}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total Users:</span>
                  <span className="text-sm font-medium">{assignedUsers.length}</span>
                </div>
                {assignedUsers.length > 0 ? (
                  assignedUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex justify-between">
                      <span className="text-sm">{user.name}</span>
                      <span className="text-sm font-medium">{user.role}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No users assigned to this warehouse</div>
                )}
                {assignedUsers.length > 3 && (
                  <div className="text-sm text-muted-foreground text-right">+{assignedUsers.length - 3} more users</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground mb-4">No inventory items found in this warehouse.</div>
            <Button variant="outline" asChild>
              <Link href="/inventory/add">Add Inventory Items</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
