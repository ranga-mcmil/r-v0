// app/(main)/branches/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Building, Users, Activity } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBranchAction } from "@/actions/branches"
import { Actions } from "../components/actions"

interface BranchDetailsPageProps {
  params: {
    id: string
  }
}

export default async function BranchDetailsPage({ params }: BranchDetailsPageProps) {
  const branchId = params.id

  // Fetch data server-side using existing action
  const branchResponse = await getBranchAction(branchId)
  
  if (!branchResponse.success || !branchResponse.data) {
    notFound()
  }

  const branch = branchResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/branches">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{branch.name}</h1>
                <Badge variant={branch.isActive ? "default" : "secondary"}>
                  {branch.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Branch ID: {branch.id}</span>
              </div>
            </div>
          </div>
          <Actions branchId={branch.id} branchName={branch.name} isActive={branch.isActive} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{branch.name}</div>
                <div className="text-sm text-muted-foreground">Branch Name</div>
              </div>
              <div>
                <div className="font-medium">{branch.location}</div>
                <div className="text-sm text-muted-foreground">Location</div>
              </div>
              <div>
                <Badge variant={branch.isActive ? "default" : "secondary"}>
                  {branch.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{branch.address.street}</div>
                <div className="text-sm text-muted-foreground">Street</div>
              </div>
              <div>
                <div className="font-medium">{branch.address.city}, {branch.address.province}</div>
                <div className="text-sm text-muted-foreground">City, Province</div>
              </div>
              {branch.address.country && (
                <div>
                  <div className="font-medium">{branch.address.country}</div>
                  <div className="text-sm text-muted-foreground">Country</div>
                </div>
              )}
              {branch.address.postalCode && (
                <div>
                  <div className="font-medium">{branch.address.postalCode}</div>
                  <div className="text-sm text-muted-foreground">Postal Code</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Branch Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total users:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total orders:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Products:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="text-sm text-muted-foreground">No activity data available</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
