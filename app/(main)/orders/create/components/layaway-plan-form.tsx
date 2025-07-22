// app/(main)/orders/create/components/layaway-plan-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { Calendar, DollarSign, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LayawayPlan {
  depositAmount: number
  installmentAmount: number
  numberOfInstallments: number
  installmentFrequencyDays: number
  firstInstallmentDate: string
}

interface LayawayPlanFormProps {
  totalAmount: number
  layawayPlan: LayawayPlan | null
  onLayawayPlanChange: (plan: LayawayPlan | null) => void
}

export function LayawayPlanForm({ totalAmount, layawayPlan, onLayawayPlanChange }: LayawayPlanFormProps) {
  const [config, setConfig] = useState<LayawayPlan>({
    depositAmount: 0,
    installmentAmount: 0,
    numberOfInstallments: 3,
    installmentFrequencyDays: 30,
    firstInstallmentDate: ""
  })

  // Initialize with default values
  useEffect(() => {
    if (layawayPlan) {
      setConfig(layawayPlan)
    } else if (totalAmount > 0) {
      const defaultDeposit = totalAmount * 0.2 // 20% default deposit
      const defaultPlan: LayawayPlan = {
        depositAmount: defaultDeposit,
        installmentAmount: 0,
        numberOfInstallments: 3,
        installmentFrequencyDays: 30,
        firstInstallmentDate: getNextMonth()
      }
      setConfig(defaultPlan)
      onLayawayPlanChange(defaultPlan)
    }
  }, [totalAmount, layawayPlan, onLayawayPlanChange])

  // Calculate installment amount when config changes
  useEffect(() => {
    if (config.depositAmount > 0 && config.numberOfInstallments > 0) {
      const remainingAmount = totalAmount - config.depositAmount
      const calculatedInstallmentAmount = remainingAmount / config.numberOfInstallments
      
      const updatedConfig = {
        ...config,
        installmentAmount: calculatedInstallmentAmount
      }
      
      setConfig(updatedConfig)
      onLayawayPlanChange(updatedConfig)
    }
  }, [config.depositAmount, config.numberOfInstallments, totalAmount])

  const updateConfig = (updates: Partial<LayawayPlan>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onLayawayPlanChange(newConfig)
  }

  const getNextMonth = () => {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth.toISOString().split('T')[0]
  }

  const getDepositPresets = () => [
    { label: "10%", amount: totalAmount * 0.1 },
    { label: "20%", amount: totalAmount * 0.2 },
    { label: "25%", amount: totalAmount * 0.25 },
    { label: "50%", amount: totalAmount * 0.5 }
  ]

  const getFrequencyText = (days: number) => {
    switch(days) {
      case 7: return "weekly"
      case 14: return "bi-weekly" 
      case 30: return "monthly"
      default: return `every ${days} days`
    }
  }

  const isValidPlan = () => {
    return config.depositAmount > 0 && 
           config.depositAmount < totalAmount && 
           config.numberOfInstallments > 0 &&
           config.firstInstallmentDate &&
           config.installmentFrequencyDays > 0
  }

  if (totalAmount <= 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Add items to the order to configure the layaway plan.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Deposit Amount */}
      <div>
        <Label htmlFor="depositAmount">Deposit Amount *</Label>
        <div className="flex gap-2 mt-1 mb-2">
          {getDepositPresets().map(preset => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-7"
              onClick={() => updateConfig({ depositAmount: preset.amount })}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="relative">
          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="depositAmount"
            type="number"
            step="0.01"
            value={config.depositAmount || ""}
            onChange={(e) => updateConfig({ depositAmount: parseFloat(e.target.value) || 0 })}
            className="pl-8"
            placeholder="Enter deposit amount"
            min="0.01"
            max={totalAmount - 0.01}
            required
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Maximum: {formatCurrency(totalAmount - 0.01)}
        </div>
      </div>

      {/* Payment Plan Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numberOfInstallments">Number of Installments *</Label>
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
          <Label htmlFor="installmentFrequency">Payment Frequency *</Label>
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
        <Label htmlFor="firstInstallmentDate">First Installment Date *</Label>
        <div className="relative mt-1">
          <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="firstInstallmentDate"
            type="date"
            value={config.firstInstallmentDate}
            onChange={(e) => updateConfig({ firstInstallmentDate: e.target.value })}
            className="pl-8"
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
            required
          />
        </div>
      </div>
      
      {/* Payment Plan Summary */}
      {isValidPlan() && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">Payment Plan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Total:</span>
              <span className="font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Deposit (today):</span>
              <span className="font-medium text-green-600">{formatCurrency(config.depositAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining Balance:</span>
              <span className="font-medium">{formatCurrency(totalAmount - config.depositAmount)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-sm">
                <span>Then {config.numberOfInstallments} payments of:</span>
                <span className="font-bold text-blue-600">{formatCurrency(config.installmentAmount)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Paid {getFrequencyText(config.installmentFrequencyDays)}, starting {config.firstInstallmentDate ? new Date(config.firstInstallmentDate).toLocaleDateString() : 'TBD'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      {config.depositAmount > 0 && (
        <div className="space-y-1">
          {config.depositAmount >= totalAmount && (
            <div className="text-xs text-red-600">
              Deposit amount must be less than the total order amount
            </div>
          )}
          {config.depositAmount < totalAmount * 0.1 && (
            <div className="text-xs text-amber-600">
              Consider a deposit of at least 10% ({formatCurrency(totalAmount * 0.1)})
            </div>
          )}
        </div>
      )}
    </div>
  )
}