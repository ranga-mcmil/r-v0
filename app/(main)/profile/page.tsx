// app/(main)/profile/page.tsx
import { getCurrentUserAction } from "@/actions/users"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"
import { ProfileSidebar } from "./components/profile-sidebar"
import { UserDTO } from "@/lib/http-service/users/types"
import { ProfileTabs } from "./components/profile-tabs"

export default async function ProfilePage() {
  // Get session on server
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  // Load user data on server
  let userData: UserDTO | null = null
  let error: string | null = null

  try {
    const response = await getCurrentUserAction()
    
    if (response.success && response.data) {
      userData = response.data
    } else {
      error = response.error || "Failed to load profile data"
    }
  } catch (err) {
    console.error("Error loading user data:", err)
    error = "An unexpected error occurred while loading your profile"
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">My Profile</h1>
          <p className="text-muted-foreground">{error || "Failed to load profile data"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with profile summary - Server rendered */}
        <div className="w-full md:w-1/3">
          <ProfileSidebar userData={userData} />
        </div>

        {/* Main content area - Tabs with forms */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <ProfileTabs userData={userData} />
        </div>
      </div>
    </div>
  )
}