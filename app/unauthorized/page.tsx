// app/unauthorized/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldX, ArrowLeft, Home, HelpCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import type { UserRole } from "@/lib/types"
import { authOptions } from "@/lib/auth/next-auth-options"

interface UnauthorizedPageProps {
  searchParams: {
    attempted?: string
  }
}

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const attemptedPath = searchParams.attempted
  
  // Get user role from NextAuth session
  const session = await getServerSession(authOptions)
  const userRole: UserRole | undefined = session?.user?.role

  // Get user-friendly role name
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrator'
      case 'ROLE_MANAGER':
        return 'Manager'
      case 'ROLE_SALES_REP':
        return 'Sales Representative'
      default:
        return 'User'
    }
  }

  // Get appropriate redirect based on role
  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return "/"
      case 'ROLE_MANAGER':
        return "/"
      case 'ROLE_SALES_REP':
        return "/"
      default:
        return "/"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6">
          {/* Compact Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <ShieldX className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          </div>

          {/* Single Comprehensive Card */}
          <Card className="border-red-200">
            <CardContent className="p-6 space-y-4">
              {/* Role and Path Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Your Role:</span>
                  <Badge variant="secondary">
                    {userRole ? getRoleName(userRole) : "Unknown"}
                  </Badge>
                </div>
                
                {attemptedPath && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Requested Page:</span>
                    <div className="font-mono text-sm bg-red-50 border border-red-200 p-2 rounded mt-1 text-red-800">
                      {attemptedPath}
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-gray-200" />

              {/* Explanation */}
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Permission Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your current role doesn't have access to this page. Contact your administrator if you need access.
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Actions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">You can return to the previous page:</p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="javascript:history.back()">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            Need assistance? Contact your system administrator
          </p>
        </div>
      </main>
    </div>
  )
}