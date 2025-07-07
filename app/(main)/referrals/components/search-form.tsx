// app/(main)/referrals/components/search-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Phone } from "lucide-react"
import { searchReferralsAction, getReferralsByPhoneAction } from "@/actions/referrals"
import { useToast } from "@/hooks/use-toast"
import type { ReferralDTO } from "@/lib/http-service/referrals/types"

interface SearchFormProps {
  onSearchResults: (referrals: ReferralDTO[]) => void
}

export function SearchForm({ onSearchResults }: SearchFormProps) {
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSearching(true)

    const formData = new FormData(event.currentTarget)
    const searchTerm = formData.get('searchTerm') as string

    try {
      const result = await searchReferralsAction(formData)
      
      if (result.success) {
        onSearchResults(result.data?.content || [])
        toast({
          title: "Search completed",
          description: `Found ${result.data?.content?.length || 0} referrals`,
        })
      } else {
        toast({
          title: "Search failed",
          description: result.error || "An error occurred during search",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handlePhoneSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSearching(true)

    const formData = new FormData(event.currentTarget)
    const phoneNumber = formData.get('phoneNumber') as string

    try {
      const result = await getReferralsByPhoneAction(phoneNumber)
      
      if (result.success) {
        onSearchResults(result.data || [])
        toast({
          title: "Phone search completed",
          description: `Found ${result.data?.length || 0} referrals`,
        })
      } else {
        toast({
          title: "Phone search failed",
          description: result.error || "An error occurred during search",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Phone search error:", error)
      toast({
        title: "Phone search failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Referrals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchTerm">Search by Name</Label>
            <div className="flex gap-2">
              <Input
                id="searchTerm"
                name="searchTerm"
                placeholder="Enter name to search"
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </form>

        <div className="border-t pt-4">
          <form onSubmit={handlePhoneSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Search by Phone</Label>
              <div className="flex gap-2">
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  className="flex-1"
                />
                <Button type="submit" disabled={isSearching} variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
