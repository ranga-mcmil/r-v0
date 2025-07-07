// app/(main)/users/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UsersTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getUsersAction } from "@/actions/users"

export default async function UsersPage() {
  // Fetch data server-side using existing actions
  let users: any[] = []
  
  try {
    const usersResponse = await getUsersAction()
    users = (usersResponse.success && usersResponse.data) ? usersResponse.data.content : []
  } catch (error) {
    console.error('Error fetching users:', error)
    users = []
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.isActive).length,
    inactiveUsers: users.filter(user => !user.isActive).length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage system users and access</p>
          </div>
          <div className="flex gap-2">
            <ExportButton users={users} />
            <Button asChild>
              <Link href="/users/create">
                <Plus className="mr-2 h-4 w-4" /> New User
              </Link>
            </Button>
          </div>
        </div>

        <Stats 
          totalUsers={stats.totalUsers}
          activeUsers={stats.activeUsers}
          inactiveUsers={stats.inactiveUsers}
        />

        <div className="border rounded-lg p-2">
          <UsersTable users={users} />
        </div>
      </main>
    </div>
  )
}