// app/(main)/inventory/adjust/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FormClient } from "../components/form-client"

interface AdjustInventoryPageProps {
  searchParams?: {
    type?: string
    productId?: string
    batchId?: string
  }
}

export default function AdjustInventoryPage({ searchParams }: AdjustInventoryPageProps) {
  const adjustmentType = searchParams?.type || "manual_adjustment"
  const title = adjustmentType === "increase" ? "Increase Inventory" : 
                adjustmentType === "decrease" ? "Decrease Inventory" : 
                "Adjust Inventory"

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/inventory">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">Make inventory adjustments</p>
          </div>
        </div>

        <Card className="p-6">
          <FormClient mode="adjust" movementType={adjustmentType} returnUrl="/inventory" />
        </Card>
      </main>
    </div>
  )
}