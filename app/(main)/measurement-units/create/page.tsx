// app/(main)/measurement-units/create/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FormClient } from "../components/form-client"

export default function CreateMeasurementUnitPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/measurement-units">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Measurement Unit</h1>
            <p className="text-muted-foreground">Add a new unit of measurement</p>
          </div>
        </div>

        <Card className="p-6">
          <FormClient returnUrl="/measurement-units" />
        </Card>
      </main>
    </div>
  )
}