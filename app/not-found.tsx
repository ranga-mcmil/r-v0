// app/not-found.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileX, ArrowLeft, Home, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto max-w-md space-y-6">
          {/* Compact Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 p-4">
                <FileX className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          </div>

          {/* Single Comprehensive Card */}
          <Card className="border-blue-200">
            <CardContent className="p-6 space-y-4">
              {/* Error Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Error Code:</span>
                  <Badge variant="secondary">404</Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">What happened:</span>
                  <div className="text-sm bg-blue-50 border border-blue-200 p-2 rounded mt-1 text-blue-800">
                    The page you're looking for doesn't exist
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Explanation */}
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Possible Reasons</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The page may have been moved, deleted, or you may have typed the URL incorrectly.
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Actions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">You can return to the previous page:</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="javascript:history.back()">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go Back
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            If you believe this is an error, contact your system administrator
          </p>
        </div>
      </main>
    </div>
  )
}