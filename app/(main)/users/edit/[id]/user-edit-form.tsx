"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { UserForm } from "@/components/user-form"
import { useToast } from "@/hooks/use-toast"

// Mock data for testing
const mockUsers = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "user-2",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
    status: "active",
  },
  {
    id: "user-3",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    status: "active",
  },
]

export function UserEditForm({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
        const foundUser = mockUsers.find((u) => u.id === userId)

        if (foundUser) {
          setUser(foundUser)
        } else {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          })
          router.push("/users")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user",
          variant: "destructive",
        })
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
