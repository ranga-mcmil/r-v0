// app/(main)/batches/edit/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBatchAction } from "@/actions/batches"
import { FormClient } from "../../components/form-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"

interface EditBatchPageProps {
  params: {
    id: string
  }
}

export default async function EditBatchPage({ params }: EditBatchPageProps) {
  const batchId = parseInt(params.id)

  if (isNaN(batchId)) {
    notFound()
  }

  // Get session for access control
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }

  // Fetch batch data server-side using existing action
  const batchResponse = await getBatchAction(batchId)
  
  if (!batchResponse.success || !batchResponse.data) {
    notFound()
  }

  const batch = batchResponse.data

  // Check if user can edit this batch (same branch or admin)
  const canEdit = session.user.role === 'ROLE_ADMIN' || 
                 (session.user.branchId && batch.createdByName)

  if (!canEdit) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/batches/${batchId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Batch: {batch.batchNumber}</h1>
            <p className="text-muted-foreground">Update batch information</p>
          </div>
        </div>

        <Card className="p-6">
          <FormClient batch={batch} returnUrl={`/batches/${batchId}`} />
        </Card>
      </main>
    </div>
  )
}
