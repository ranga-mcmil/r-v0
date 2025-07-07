// app/(main)/batches/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Package, User, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBatchAction } from "@/actions/batches"
import { Actions } from "../components/actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"

interface BatchDetailsPageProps {
  params: {
    id: string
  }
}

export default async function BatchDetailsPage({ params }: BatchDetailsPageProps) {
  const batchId = parseInt(params.id)

  if (isNaN(batchId)) {
    notFound()
  }

  // Get session for access control
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }

  // Fetch data server-side using existing action
  const batchResponse = await getBatchAction(batchId)
  
  if (!batchResponse.success || !batchResponse.data) {
    notFound()
  }

  const batch = batchResponse.data

  // Check if user can manage this batch (same branch or admin)
  const canManage = session.user.role === 'ROLE_ADMIN' || 
                   (session.user.branchId && batch.createdByName)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/batches">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{batch.batchNumber}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Batch ID: {batch.id}</span>
              </div>
            </div>
          </div>
          {canManage && (
            <Actions batchId={batch.id} batchNumber={batch.batchNumber} />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Batch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{batch.batchNumber}</div>
                <div className="text-sm text-muted-foreground">Batch Number</div>
              </div>
              {batch.description && (
                <div>
                  <div className="font-medium">{batch.description}</div>
                  <div className="text-sm text-muted-foreground">Description</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">ID: {batch.id}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Creation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{batch.createdByName}</div>
                  <div className="text-sm text-muted-foreground">Created by</div>
                </div>
              </div>
              <div>
                <div className="font-medium">
                  {new Date(batch.createdDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-sm text-muted-foreground">Created on</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory & Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Total inventory items:</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total production records:</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="text-sm text-muted-foreground">No inventory or production data available</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}