// app/(main)/dashboard/components/low-stock-alerts.tsx
import { Button } from "@/components/ui/button"
import { Package, TrendingUp } from "lucide-react"
import Link from "next/link"

export function LowStockAlerts() {
  return (
    <div className="text-center py-8">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Low Stock Monitoring</h3>
      <p className="text-muted-foreground mb-4">
        Low stock alerts will appear here when products need restocking
      </p>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          We'll automatically monitor your inventory levels and notify you when:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Products reach critical stock levels (≤5 units)</li>
          <li>• Products fall below reorder points</li>
          <li>• High-demand items need restocking</li>
        </ul>
      </div>
      <div className="mt-6 flex gap-2 justify-center">
        <Button size="sm" variant="outline" asChild>
          <Link href="/inventory">
            <Package className="mr-2 h-4 w-4" />
            Manage Inventory
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href="/products">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Products
          </Link>
        </Button>
      </div>
    </div>
  )
}