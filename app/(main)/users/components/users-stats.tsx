import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserMinus } from "lucide-react"

interface UsersStatsProps {
  totalUsers: number
  activeUsers: number
  adminCount: number
  managerCount: number
  salesRepCount: number
  filteredCount?: number
}

export function UsersStats({
  totalUsers,
  activeUsers,
  adminCount,
  managerCount,
  salesRepCount,
  filteredCount,
}: UsersStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {filteredCount !== undefined && filteredCount !== totalUsers
              ? `Filtered from ${filteredCount} total`
              : "All users"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}% of total users` : "0% of total users"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Roles</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {adminCount} / {managerCount} / {salesRepCount}
          </div>
          <p className="text-xs text-muted-foreground">Admins / Managers / Sales Reps</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers - activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {totalUsers > 0
              ? `${Math.round(((totalUsers - activeUsers) / totalUsers) * 100)}% of total users`
              : "0% of total users"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
