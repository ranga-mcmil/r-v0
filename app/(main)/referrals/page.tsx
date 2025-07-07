// app/(main)/referrals/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ReferralsTable } from "./components/table"
import { Stats } from "./components/stats"
import { ExportButton } from "./components/export-button"
import { getAllReferralsAction } from "@/actions/referrals"

export default async function ReferralsPage() {
  // Fetch data server-side using existing actions
  let referrals: any[] = []
  
  try {
    const referralsResponse = await getAllReferralsAction()
    referrals = (referralsResponse.success && referralsResponse.data) ? referralsResponse.data.content : []
  } catch (error) {
    console.error('Error fetching referrals:', error)
    referrals = []
  }

  const stats = {
    totalReferrals: referrals.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Referrals</h1>
            <p className="text-muted-foreground">Manage referral partners</p>
          </div>
          <div className="flex gap-2">
            <ExportButton referrals={referrals} />
            <Button asChild>
              <Link href="/referrals/create">
                <Plus className="mr-2 h-4 w-4" /> New Referral
              </Link>
            </Button>
          </div>
        </div>

        <Stats totalReferrals={stats.totalReferrals} />

        <div className="border rounded-lg p-2">
          <ReferralsTable referrals={referrals} />
        </div>
      </main>
    </div>
  )
}
