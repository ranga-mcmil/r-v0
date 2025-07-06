"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ReferrerForm } from "@/components/referrer-form"
import { useToast } from "@/hooks/use-toast"

// Mock data for testing
const mockReferrers = [
  {
    id: "ref-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    company: "John Doe Construction",
    status: "active",
    address: "123 Main St, Anytown, USA",
    notes: "Regular referrer, provides quality leads",
  },
  {
    id: "ref-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    company: "Smith Builders",
    status: "active",
    address: "456 Oak Ave, Somewhere, USA",
    notes: "New referrer, high potential",
  },
]

export function ReferrerEditForm({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [referrer, setReferrer] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchReferrer = async () => {
      try {
        const referrerId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
        const foundReferrer = mockReferrers.find((r) => r.id === referrerId)

        if (foundReferrer) {
          setReferrer(foundReferrer)
        } else {
          toast({
            title: "Error",
            description: "Referrer not found",
            variant: "destructive",
          })
          router.push("/referrers")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load referrer",
          variant: "destructive",
        })
      }
    }

    fetchReferrer()
  }, [params.id, router, toast])

  const handleSubmit = async (formData) => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Referrer updated",
        description: "The referrer has been updated successfully",
      })

      router.push("/referrers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update referrer",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Referrer</h1>
            <p className="text-muted-foreground">Update referrer information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Referrer Details</CardTitle>
            <CardDescription>Update the referrer information below</CardDescription>
          </CardHeader>
          <CardContent>
            {referrer && <ReferrerForm initialData={referrer} onSubmit={handleSubmit} isSubmitting={saving} />}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
