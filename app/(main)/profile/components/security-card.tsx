// app/(main)/profile/components/security-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function SecurityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary/60" />
            </div>
            <div>
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app to generate one-time codes
              </p>
            </div>
          </div>
          <Button variant="outline">
            Setup
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary/60" />
            </div>
            <div>
              <h4 className="font-medium">SMS Authentication</h4>
              <p className="text-sm text-muted-foreground">Receive verification codes via SMS</p>
            </div>
          </div>
          <Button variant="outline">
            Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}