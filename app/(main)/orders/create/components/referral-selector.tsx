// app/(main)/orders/create/components/referral-selector.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, UserPlus } from "lucide-react"
import { getAllReferralsAction } from "@/actions/referrals"
import type { ReferralDTO } from "@/lib/http-service/referrals/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateReferralForm } from "./create-referral-form"

interface ReferralSelectorProps {
  onReferralSelect: (referralId: number | null) => void
  selectedReferralId: number | null
}

export function ReferralSelector({ onReferralSelect, selectedReferralId }: ReferralSelectorProps) {
  const [referrals, setReferrals] = useState<ReferralDTO[]>([])
  const [filteredReferrals, setFilteredReferrals] = useState<ReferralDTO[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const selectedReferral = referrals.find(r => r.id === selectedReferralId)

  useEffect(() => {
    loadReferrals()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = referrals.filter(referral =>
        referral.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.phoneNumber.includes(searchTerm)
      )
      setFilteredReferrals(filtered)
    } else {
      setFilteredReferrals(referrals.slice(0, 10)) // Show first 10 by default
    }
  }, [referrals, searchTerm])

  const loadReferrals = async () => {
    setLoading(true)
    try {
      const result = await getAllReferralsAction({ pageSize: 100 })
      if (result.success && result.data) {
        setReferrals(result.data.content)
      }
    } catch (error) {
      console.error('Failed to load referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReferralCreated = (newReferral: ReferralDTO) => {
    setReferrals(prev => [newReferral, ...prev])
    onReferralSelect(newReferral.id)
    setShowCreateDialog(false)
  }

  if (selectedReferral) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">
                  {selectedReferral.fullName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedReferral.phoneNumber}
                </div>
                {selectedReferral.address && (
                  <div className="text-sm text-muted-foreground">
                    {selectedReferral.address}
                  </div>
                )}
                <div className="text-xs text-green-600 mt-1">
                  ✓ Commission will be calculated
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReferralSelect(null)}
              >
                Remove
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReferralSelect(null)}
              >
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* No Referral Option */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onReferralSelect(null)}
          className="flex-1"
        >
          No Referral (Optional)
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="referral-search">Search Referrals</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="referral-search"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Create New Referral */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Referral
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Referral</DialogTitle>
            <DialogDescription>
              Add a new referral to earn commission on this order
            </DialogDescription>
          </DialogHeader>
          <CreateReferralForm onReferralCreated={handleReferralCreated} />
        </DialogContent>
      </Dialog>

      {/* Referral List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading referrals...
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {searchTerm ? 'No referrals found matching your search' : 'No referrals available'}
          </div>
        ) : (
          filteredReferrals.map((referral) => (
            <Card 
              key={referral.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onReferralSelect(referral.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {referral.fullName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {referral.phoneNumber}
                    </div>
                    {referral.address && (
                      <div className="text-sm text-muted-foreground">
                        {referral.address}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">Select</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {searchTerm && filteredReferrals.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          Showing {filteredReferrals.length} result{filteredReferrals.length !== 1 ? 's' : ''}
        </div>
      )}

      {selectedReferralId === null && (
        <div className="text-xs text-muted-foreground text-center p-2 bg-blue-50 rounded">
          💡 Selecting a referral will calculate commission for this order
        </div>
      )}
    </div>
  )
}