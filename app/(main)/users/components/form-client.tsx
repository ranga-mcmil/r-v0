// app/(main)/users/components/form-client.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createUserAction, updateUserAction } from "@/actions/users"
import { getBranchesAction } from "@/actions/branches"
import type { UserDTO } from "@/lib/http-service/users/types"
import type { BranchDTO } from "@/lib/http-service/branches/types"

interface FormClientProps {
  user?: UserDTO | null
  returnUrl: string
}

export function FormClient({ user, returnUrl }: FormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branches, setBranches] = useState<BranchDTO[]>([])
  const [selectedRole, setSelectedRole] = useState(user?.role || "")
  const { toast } = useToast()
  const router = useRouter()

  // Fetch branches for role-based branch selection
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesResponse = await getBranchesAction()
        if (branchesResponse.success && branchesResponse.data) {
          setBranches(branchesResponse.data.content)
        }
      } catch (error) {
        console.error('Error fetching branches:', error)
      }
    }
    fetchBranches()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      
      if (user) {
        // Update existing user
        result = await updateUserAction(formData, user.id)
      } else {
        // Create new user
        result = await createUserAction(formData)
      }

      if (result.success) {
        toast({
          title: user ? "User updated" : "User created",
          description: user ? "User has been updated successfully" : "User has been created successfully",
        })
        router.push(returnUrl)
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const requiresBranch = selectedRole === "ROLE_MANAGER" || selectedRole === "ROLE_SALES_REP"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user?.firstName || ""}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={user?.lastName || ""}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email || ""}
          placeholder="Enter email address"
          required
        />
      </div>

      {!user && (
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            required
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">
            Role <span className="text-red-500">*</span>
          </Label>
          <Select name="role" value={selectedRole} onValueChange={setSelectedRole} required>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
              <SelectItem value="ROLE_MANAGER">Manager</SelectItem>
              <SelectItem value="ROLE_SALES_REP">Sales Rep</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {requiresBranch && (
          <div className="space-y-2">
            <Label htmlFor="branchId">
              Branch <span className="text-red-500">*</span>
            </Label>
            <Select name="branchId" defaultValue={user?.branchId || ""} required>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push(returnUrl)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  )
}