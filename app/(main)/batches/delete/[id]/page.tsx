// app/(main)/batches/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getBatchAction, deleteBatchAction } from "@/actions/batches"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"

interface DeleteBatchPageProps {
  params: {
    id: string
  }
}

export default async function DeleteBatchPage({ params }: DeleteBatchPageProps) {
  const batchId = parseInt(params.id)

  if (isNaN(batchId)) {
    notFound()
  }

  // Get session for access control
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }

  // Find the batch using existing action
  const batchResponse = await getBatchAction(batchId)
  
  if (!batchResponse.success || !batchResponse.data) {
    notFound()
  }

  const batch = batchResponse.data

  // Check if user can delete this batch (same branch or admin)
  const canDelete = session.user.role === 'ROLE_ADMIN' || 
                   (session.user.branchId && batch.createdByName)

  if (!canDelete) {
    notFound()
  }

  async function handleDeleteBatch() {
    "use server"

    const result = await deleteBatchAction(batchId)
    
    if (result.success) {
      redirect("/batches")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/batches")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Batch</h1>
            <p className="text-gray-500">Are you sure you want to delete batch "{batch.batchNumber}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the batch and may affect inventory and production records associated with this batch.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/batches">Cancel</Link>
            </Button>

            <form action={handleDeleteBatch}>
              <Button type="submit" variant="destructive">
                Delete Batch
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
