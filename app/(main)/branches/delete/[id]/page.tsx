// app/(main)/branches/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getBranchAction, deleteBranchAction } from "@/actions/branches"
import { notFound } from "next/navigation"

interface DeleteBranchPageProps {
  params: {
    id: string
  }
}

export default async function DeleteBranchPage({ params }: DeleteBranchPageProps) {
  const branchId = params.id

  // Find the branch using existing action
  const branchResponse = await getBranchAction(branchId)
  
  if (!branchResponse.success || !branchResponse.data) {
    notFound()
  }

  const branch = branchResponse.data

  async function handleDeleteBranch() {
    "use server"

    const result = await deleteBranchAction(branchId)
    
    if (result.success) {
      redirect("/branches")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/branches")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Branch</h1>
            <p className="text-gray-500">Are you sure you want to delete "{branch.name}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the branch and may affect users, products, and orders associated with this branch.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/branches">Cancel</Link>
            </Button>

            <form action={handleDeleteBranch}>
              <Button type="submit" variant="destructive">
                Delete Branch
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
