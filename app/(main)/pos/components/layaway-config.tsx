// app/(main)/pos/components/layaway-config.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign } from "lucide-react"

interface LayawayPlan {
  depositAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

interface LayawayConfigProps {
  config: LayawayPlan
  total: number
  calculatedInstallmentAmount: number
  onConfigChange: (config: LayawayPlan) => void
}

export function LayawayConfig({ config, total, calculatedInstallmentAmount, onConfigChange }: LayawayConfigProps) {
  const updateConfig = (updates: Partial<LayawayPlan>) => {
    onConfigChange({ ...config, ...updates })
  }

  const getDepositPresets = () => [
    { label: "10%", amount: total * 0.1 },
    { label: "20%", amount: total * 0.2 },
    { label: "25%", amount: total * 0.25 },
    { label: "50%", amount: total * 0.5 }
  ]

  const getFrequencyText = (days: number) => {
    switch(days) {
      case 7: return "week"
      case 14: return "2 weeks" 
      case 30: return "month"
      default: return `${days} days`
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Layaway Plan Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deposit Amount with Presets */}
        <div>
          <Label>Deposit Amount *</Label>
          <div className="flex gap-1 mt-1 mb-2">
            {getDepositPresets().map(preset => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-6"
                onClick={() => updateConfig({ depositAmount: preset.amount })}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                value={config.depositAmount}
                onChange={(e) => updateConfig({ depositAmount: parseFloat(e.target.value) || 0 })}
                className="pl-8"
                placeholder="0.00"
                min="0.01"
                max={total - 0.01}
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Maximum: ${(total - 0.01).toFixed(2)}
          </div>
        </div>

        {/* Payment Plan Configuration */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-sm">Number of Installments</Label>
            <Select 
              value={config.numberOfInstallments.toString()} 
              onValueChange={(value) => updateConfig({ numberOfInstallments: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 payments</SelectItem>
                <SelectItem value="3">3 payments</SelectItem>
                <SelectItem value="4">4 payments</SelectItem>
                <SelectItem value="6">6 payments</SelectItem>
                <SelectItem value="8">8 payments</SelectItem>
                <SelectItem value="12">12 payments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Payment Frequency</Label>
            <Select 
              value={config.installmentFrequencyDays.toString()}
              onValueChange={(value) => updateConfig({ installmentFrequencyDays: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Weekly</SelectItem>
                <SelectItem value="14">Bi-weekly</SelectItem>
                <SelectItem value="30">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* First Payment Date */}
        <div>
          <Label className="text-sm">First Installment Date *</Label>
          <Input
            type="date"
            value={config.firstInstallmentDate}
            onChange={(e) => updateConfig({ firstInstallmentDate: e.target.value })}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
            className="mt-1"
            required
          />
        </div>
        
        {/* Calculated Plan Summary */}
        {config.depositAmount > 0 && calculatedInstallmentAmount > 0 && (
          <div className="p-3 bg-muted/50 rounded border">
            <div className="text-sm font-medium mb-2">Payment Plan Summary:</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Deposit (today):</span>
                <span className="font-medium">${config.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Then {config.numberOfInstallments} payments of:</span>
                <span className="font-medium">${calculatedInstallmentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Every {getFrequencyText(config.installmentFrequencyDays)}:</span>
                <span>Starting {config.firstInstallmentDate ? new Date(config.firstInstallmentDate).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}