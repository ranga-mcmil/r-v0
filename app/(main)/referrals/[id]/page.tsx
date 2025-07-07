// app/(main)/referrals/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, MapPin, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getReferralAction } from "@/actions/referrals"
import { Actions } from "../components/actions"

interface ReferralDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ReferralDetailsPage({ params }: ReferralDetailsPageProps) {
  const referralId = parseInt(params.id)

  if (isNaN(referralId)) {
    notFound()
  }

  // Fetch data server-side using existing action
  const referralResponse = await getReferralAction(referralId)
  
  if (!referralResponse.success || !referralResponse.data) {
    notFound()
  }

  const referral = referralResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/referrals">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{referral.fullName}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Referral ID: {referral.id}</span>
              </div>
            </div>
          </div>
          <Actions referralId={referral.id} referralName={referral.fullName} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Referral Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{referral.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{referral.phoneNumber}</span>
              </div>
              {referral.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{referral.address}</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                ID: {referral.id}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Referral Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Successful referrals:</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total commissions:</span>
                  <span className="text-sm font-medium">$0.00</span>
                </div>
                <div className="text-sm text-muted-foreground">No referral activity found</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
