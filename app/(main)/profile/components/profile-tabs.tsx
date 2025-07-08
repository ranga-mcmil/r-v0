// app/(main)/profile/components/profile-tabs.tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { UserDTO } from "@/lib/http-service/users/types"
import { BranchDTO } from "@/lib/http-service/branches/types"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { SecurityCard } from "./security-card"

interface ProfileTabsProps {
  userData: UserDTO
  branchData: BranchDTO | null
}

export function ProfileTabs({ userData, branchData }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full md:w-auto">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        <ProfileForm userData={userData} branchData={branchData} />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <PasswordForm userData={userData} />
        <SecurityCard />
      </TabsContent>
    </Tabs>
  )
}