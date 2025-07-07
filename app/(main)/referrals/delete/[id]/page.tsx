// app/(main)/referrals/delete/[id]/page.tsx
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getReferralAction, deleteReferralAction } from "@/actions/referrals"
import { notFound } from "next/navigation"

interface DeleteReferralPageProps {
  params: {
    id: string
  }
}

export default async function DeleteReferralPage({ params }: DeleteReferralPageProps) {
  const referralId = parseInt(params.id)

  if (isNaN(referralId)) {
    notFound()
  }

  // Find the referral using existing action
  const referralResponse = await getReferralAction(referralId)
  
  if (!referralResponse.success || !referralResponse.data) {
    notFound()
  }

  const referral = referralResponse.data

  async function handleDeleteReferral() {
    "use server"

    const result = await deleteReferralAction(referralId)
    
    if (result.success) {
      redirect("/referrals")
    } else {
      // In a real app, you'd handle the error appropriately
      redirect("/referrals")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6 p-6 border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Delete Referral</h1>
            <p className="text-gray-500">Are you sure you want to delete "{referral.fullName}"?</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
            <p className="font-medium">Warning</p>
            <p className="mt-1">
              This action cannot be undone. This will permanently delete the referral and may affect their referral history.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/referrals">Cancel</Link>
            </Button>

            <form action={handleDeleteReferral}>
              <Button type="submit" variant="destructive">
                Delete Referral
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
