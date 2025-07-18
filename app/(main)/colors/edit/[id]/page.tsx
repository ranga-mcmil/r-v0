// app/(main)/colors/edit/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getColorAction } from "@/actions/colors"
import { ColorFormClient } from "../../components/color-form-client"

interface EditColorPageProps {
  params: {
    id: string
  }
}

export default async function EditColorPage({ params }: EditColorPageProps) {
  const colorId = parseInt(params.id)

  if (isNaN(colorId)) {
    notFound()
  }

  // Fetch color data server-side using existing action
  const colorResponse = await getColorAction(colorId)
  
  if (!colorResponse.success || !colorResponse.data) {
    notFound()
  }

  const color = colorResponse.data

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/colors/${colorId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Color: {color.name}</h1>
            <p className="text-muted-foreground">Update color information</p>
          </div>
        </div>

        <Card className="p-6">
          <ColorFormClient color={color} returnUrl={`/colors/${colorId}`} />
        </Card>
      </main>
    </div>
  )
}