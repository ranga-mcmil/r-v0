"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { UserForm } from "@/components/user-form"
import { useToast } from "@/hooks/use-toast"
import { users } from "@/lib/dummy-data"
import EditUserLoading from "./loading"

export function UserEditClient({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const userId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
        console.log("Fetching user with ID:", userId)
        console.log(
          "Available users:",
          users.map((u) => u.id),
        )

        // Try to find the user by ID
        let foundUser = users.find((u) => u.id === userId)

        // If not found, use the first user as a fallback
        if (!foundUser && users.length > 0) {
          console.log("User not found, using first user as fallback")
          foundUser = users[0]
        }

        if (foundUser) {
          console.log("Found user:", foundUser)
          setUser(foundUser)
        } else {
          toast({
            title: "Error",
            description: `No users available in the system`,
            variant: "destructive",
          })
          router.push("/users")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to load user",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id, router, toast])

  const handleSubmit = async (formData) => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "User updated",
        description: "The user has been updated successfully",
      })

      router.push("/users")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Show loading skeleton until data is ready
  if (loading) {
    return <EditUserLoading />
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
            <h1 className="text-2xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Update user information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Update the user information below</CardDescription>
          </CardHeader>
          <CardContent>
            {user && <UserForm initialData={user} onSubmit={handleSubmit} isSubmitting={saving} />}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
