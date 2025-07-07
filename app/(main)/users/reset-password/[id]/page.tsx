// app/(main)/users/reset-password/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserAction } from "@/actions/users"
import { ResetPasswordForm } from "./reset-password-form"

interface ResetPasswordPageProps {
  params: {
    id: string
  }
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const userId = params.id

  // Fetch user data server-side using existing action
  const userResponse = await getUserAction(userId)
  
  if (!userResponse.success || !userResponse.data) {
    notFound()
  }

  const user = userResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/users/${userId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Reset Password: {user.firstName} {user.lastName}</h1>
            <p className="text-muted-foreground">Set a new password for this user</p>
          </div>
        </div>

        <Card className="p-6 max-w-md mx-auto w-full">
          <ResetPasswordForm userId={userId} returnUrl={`/users/${userId}`} />
        </Card>
      </main>
    </div>
  )
}