// app/(main)/orders/create/components/referral-selector.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Plus, UserPlus, Search, X } from "lucide-react"
import { getAllReferralsAction } from "@/actions/referrals"
import type { ReferralDTO } from "@/lib/http-service/referrals/types"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const selectedReferral = referrals.find(r => r.id === selectedReferralId)

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    setLoading(true)
    try {
      const result = await getAllReferralsAction({ pageSize: 200 }) // Load more for search
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

  const formatReferralSubtext = (referral: ReferralDTO) => {
    const parts = [referral.phoneNumber]
    if (referral.address) parts.push(referral.address)
    return parts.join(' • ')
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
                  {formatReferralSubtext(selectedReferral)}
                </div>
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
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Referral (Optional)</Label>
        
        {/* No Referral Option */}
        <Button
          type="button"
          variant="outline"
          onClick={() => onReferralSelect(null)}
          className={cn(
            "w-full justify-start",
            selectedReferralId === null && "bg-muted"
          )}
        >
          <X className="mr-2 h-4 w-4" />
          No Referral
        </Button>

        {/* Referral Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search referrals...</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search referrals by name or phone..." />
              <CommandList>
                <CommandEmpty>
                  <div className="text-center py-6">
                    <UserPlus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No referrals found.</p>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {referrals.map((referral) => (
                    <CommandItem
                      key={referral.id}
                      value={`${referral.fullName} ${referral.phoneNumber} ${referral.address || ''}`}
                      onSelect={() => {
                        onReferralSelect(referral.id)
                        setOpen(false)
                      }}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <UserPlus className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {referral.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatReferralSubtext(referral)}
                          </div>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedReferralId === referral.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowCreateDialog(true)
                    }}
                    className="text-blue-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new referral
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Create New Referral Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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

      {/* Alternative: Manual Entry Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Or create new referral
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

      {/* Info Message */}
      <div className="text-xs text-muted-foreground text-center p-2 bg-blue-50 rounded">
        💡 Selecting a referral will calculate commission for this order
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground text-center">
          Loading referrals...
        </div>
      )}
    </div>
  )
}