// app/(main)/users/toggle-status/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserAction, toggleUserStatusAction } from "@/actions/users"
import { notFound } from "next/navigation"

interface ToggleUserStatusPageProps {
  params: {
    id: string
  }
}

export default async function ToggleUserStatusPage({ params }: ToggleUserStatusPageProps) {
  const userId = params.id

  // Find the user using existing action
  const userResponse = await getUserAction(userId)
  
  if (!userResponse.success || !userResponse.data) {
    notFound()
  }

  const user = userResponse.data
  const newStatus = user.isActive ? 'deactivate' : 'activate'

  async function handleToggleUserStatus() {
    "use server"

    const result = await toggleUserStatusAction(userId)
    
    if (result.success) {
      redirect("/users")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/users")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">{newStatus === 'activate' ? 'Activate' : 'Deactivate'} User</h1>
            <p className="text-gray-500">
              Are you sure you want to {newStatus} "{user.firstName} {user.lastName}"?
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Notice</p>
            <p className="mt-1">
              {newStatus === 'activate' 
                ? 'This will restore the user\'s access to the system.'
                : 'This will prevent the user from accessing the system.'
              }
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/users">Cancel</Link>
            </Button>

            <form action={handleToggleUserStatus}>
              <Button 
                type="submit" 
                variant={newStatus === 'activate' ? 'default' : 'destructive'}
              >
                {newStatus === 'activate' ? 'Activate User' : 'Deactivate User'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}