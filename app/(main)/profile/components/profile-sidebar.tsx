// app/(main)/profile/components/profile-sidebar.tsx
import { Camera, Clock, Shield, User, UserRound } from "lucide-react"
import { UserDTO } from "@/lib/http-service/users/types"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { USER_ROLES } from "@/lib/types"

interface ProfileSidebarProps {
  userData: UserDTO
  branchData: BranchDTO | null
}

function getRoleDisplayName(role: string) {
  switch (role) {
    case USER_ROLES.ADMIN:
    case 'ROLE_ADMIN':
      return 'Administrator'
    case USER_ROLES.MANAGER:
    case 'ROLE_MANAGER':
      return 'Manager'
    case USER_ROLES.SALES_REP:
    case 'ROLE_SALES_REP':
      return 'Sales Representative'
    default:
      return role.replace('ROLE_', '').replace('_', ' ')
  }
}

export function ProfileSidebar({ userData, branchData }: ProfileSidebarProps) {
  return (
    <div className="sticky top-6">
      <div className="border rounded-lg">
        <div className="pt-6 px-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-16 w-16 text-primary/60" />
              </div>
              <button className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload new picture</span>
              </button>
            </div>
            <h3 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h3>
            <p className="text-muted-foreground">{getRoleDisplayName(userData.role)}</p>
            <p className="text-sm text-muted-foreground mt-1">{userData.email}</p>
          </div>

          <div className="border-t border-border my-4"></div>

          <div className="space-y-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary/60" />
              </div>
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground">{userData.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary/60" />
              </div>
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{getRoleDisplayName(userData.role)}</p>
              </div>
            </div>

            {userData.branchId && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-sm text-muted-foreground">
                    {branchData ? branchData.name : 'Loading...'}
                  </p>
                  {branchData?.location && (
                    <p className="text-xs text-muted-foreground">
                      {branchData.location}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}