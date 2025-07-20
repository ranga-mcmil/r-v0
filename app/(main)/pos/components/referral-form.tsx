// app/(main)/pos/components/referral-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { createReferralAction } from "@/actions/referrals"
import type { ReferralDTO } from "@/lib/http-service/referrals/types"

interface ReferralFormProps {
  onReferralCreated: (referral: ReferralDTO) => void
  onCancel: () => void
}

export function ReferralForm({ onReferralCreated, onCancel }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value)
      })

      const response = await createReferralAction(submitData)

      if (response.success) {
        toast({
          title: "Referral created",
          description: `${formData.fullName} has been added as a referral.`,
        })
        onReferralCreated(response.data!)
      } else {
        toast({
          title: "Error creating referral",
          description: response.error || "Failed to create referral",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          required
          disabled={isSubmitting}
          placeholder="Enter full name"
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          required
          disabled={isSubmitting}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          disabled={isSubmitting}
          placeholder="Enter address (optional)"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Referral'
          )}
        </Button>
      </div>
    </form>
  )
}