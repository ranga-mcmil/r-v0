"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

interface UserFormProps {
  user?: User
  warehouses?: { id: string; name: string }[]
}

export function UserFormClient({ user, warehouses = [] }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
\
Let's update the add user page:
