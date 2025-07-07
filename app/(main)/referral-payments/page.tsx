// app/(main)/referral-payments/page.tsx
import { Button } from "@/components/ui/button"
import { ReferralPaymentsTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getAllReferralPaymentsAction } from "@/actions/referral-payments"
import { getCurrentUserAction } from "@/actions/users"
import { notFound } from "next/navigation"

export default async function ReferralPaymentsPage() {
  // Get current user to determine branch
  const userResponse = await getCurrentUserAction()
  
  if (!userResponse.success || !userResponse.data?.branchId) {
    notFound()
  }

  const branchId = userResponse.data.branchId

  // Fetch data server-side using existing actions
  let payments: any[] = []
  
  try {
    const paymentsResponse = await getAllReferralPaymentsAction(branchId)
    payments = (paymentsResponse.success && paymentsResponse.data) ? paymentsResponse.data.content : []
  } catch (error) {
    console.error('Error fetching referral payments:', error)
    payments = []
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Referral Payments</h1>
            <p className="text-muted-foreground">Manage referral commission payments</p>
          </div>
          <div className="flex gap-2">
            <ExportButton payments={payments} />
          </div>
        </div>

        <Stats payments={payments} />

        <div className="border rounded-lg p-2">
          <ReferralPaymentsTable payments={payments} />
        </div>
      </main>
    </div>
  )
}