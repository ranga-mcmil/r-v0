"use server"

import { revalidatePath } from "next/cache"
import type { User, UserRole } from "@/lib/types"

// Dummy users data
const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@roofstar.com",
    role: "admin",
    status: "active",
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-04-20T14:30:00Z",
    lastLogin: "2023-05-01T09:15:00Z",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah@roofstar.com",
    role: "store_manager",
    status: "active",
    warehouseId: "1",
    warehouseName: "Main Warehouse",
    createdAt: "2023-02-10T10:20:00Z",
    updatedAt: "2023-04-15T11:45:00Z",
    lastLogin: "2023-04-30T16:20:00Z",
  },
  {
    id: "3",
    name: "Mike Sales",
    email: "mike@roofstar.com",
    role: "sales_rep",
    status: "active",
    createdAt: "2023-03-05T09:30:00Z",
    updatedAt: "2023-04-10T13:15:00Z",
    lastLogin: "2023-04-29T14:10:00Z",
  },
  {
    id: "4",
    name: "Lisa Manager",
    email: "lisa@roofstar.com",
    role: "store_manager",
    status: "inactive",
    warehouseId: "2",
    warehouseName: "East Warehouse",
    createdAt: "2023-01-20T11:00:00Z",
    updatedAt: "2023-04-05T10:30:00Z",
    lastLogin: "2023-03-15T09:45:00Z",
  },
  {
    id: "5",
    name: "Tom Sales",
    email: "tom@roofstar.com",
    role: "sales_rep",
    status: "active",
    createdAt: "2023-02-25T14:20:00Z",
    updatedAt: "2023-04-18T15:10:00Z",
    lastLogin: "2023-04-28T11:30:00Z",
  },
]

// Helper function to get users from "database"
function getUsersFromDB(): User[] {
  // In a real app, this would fetch from a database
  return [...dummyUsers]
}

// Get users with filtering, sorting, and pagination
export async function getUsers(params: {
  search?: string
  role?: string
  status?: string
  fromDate?: string
  toDate?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: number
  pageSize?: number
}) {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let users = getUsersFromDB()

  // Apply search filter
  if (params.search) {
    const query = params.search.toLowerCase()
    users = users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
  }

  // Apply role filter
  if (params.role && params.role !== "all") {
    users = users.filter((user) => user.role === params.role)
  }

  // Apply status filter
  if (params.status && params.status !== "all") {
    users = users.filter((user) => user.status === params.status)
  }

  // Apply date range filter
  if (params.fromDate) {
    const fromDate = new Date(params.fromDate)
    users = users.filter((user) => new Date(user.createdAt) >= fromDate)
  }

  if (params.toDate) {
    const toDate = new Date(params.toDate)
    users = users.filter((user) => new Date(user.createdAt) <= toDate)
  }

  // Calculate totals
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const adminCount = users.filter((user) => user.role === "admin").length
  const managerCount = users.filter((user) => user.role === "store_manager").length
  const salesRepCount = users.filter((user) => user.role === "sales_rep").length

  // Apply sorting
  if (params.sortField) {
    users.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (params.sortField) {
        case "email":
          aValue = a.email
          bValue = b.email
          break
        case "role":
          aValue = a.role
          bValue = b.role
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "lastLogin":
          aValue = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
          bValue = b.lastLogin ? new Date(b.lastLogin).getTime() : 0
          break
        case "createdAt":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case "name":
        default:
          aValue = a.name
          bValue = b.name
      }

      if (params.sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }

  // Apply pagination
  const pageSize = params.pageSize || 10
  const page = params.page || 1
  const totalPages = Math.ceil(users.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedUsers = users.slice(startIndex, endIndex)

  return {
    users: paginatedUsers,
    pagination: {
      totalUsers,
      activeUsers,
      adminCount,
      managerCount,
      salesRepCount,
      totalPages,
      currentPage: page,
      pageSize,
      startIndex,
      endIndex,
    },
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const users = getUsersFromDB()
  return users.find((user) => user.id === userId) || null
}

// Create user
export async function createUser(userData: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      return {
        success: false,
        message: "Name, email, and role are required",
      }
    }

    // Check if email already exists
    const users = getUsersFromDB()
    if (users.some((user) => user.email === userData.email)) {
      return {
        success: false,
        message: "Email already exists",
      }
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
      status: userData.status || "active",
      warehouseId: userData.warehouseId,
      warehouseName: userData.warehouseName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
    }

    // In a real app, this would save to a database
    dummyUsers.push(newUser)

    revalidatePath("/users")
    return {
      success: true,
      message: "User created successfully",
      user: newUser,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      message: "An error occurred while creating the user",
    }
  }
}

// Update user
export async function updateUser(
  userId: string,
  userData: Partial<User>,
): Promise<{ success: boolean; message: string; user?: User }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      return {
        success: false,
        message: "Name, email, and role are required",
      }
    }

    // Find user
    const userIndex = dummyUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Check if email already exists (excluding current user)
    if (dummyUsers.some((user) => user.email === userData.email && user.id !== userId)) {
      return {
        success: false,
        message: "Email already exists",
      }
    }

    // Update user
    const updatedUser: User = {
      ...dummyUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    // In a real app, this would update in a database
    dummyUsers[userIndex] = updatedUser

    revalidatePath(`/users/${userId}`)
    revalidatePath("/users")
    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      message: "An error occurred while updating the user",
    }
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Find user
    const userIndex = dummyUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // In a real app, this would delete from a database
    dummyUsers.splice(userIndex, 1)

    revalidatePath("/users")
    return {
      success: true,
      message: "User deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      message: "An error occurred while deleting the user",
    }
  }
}

// Change user status
export async function changeUserStatus(
  userId: string,
  status: "active" | "inactive",
): Promise<{ success: boolean; message: string }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Find user
    const userIndex = dummyUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Update status
    dummyUsers[userIndex].status = status
    dummyUsers[userIndex].updatedAt = new Date().toISOString()

    revalidatePath(`/users/${userId}`)
    revalidatePath("/users")
    return {
      success: true,
      message: `User ${status === "active" ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    console.error("Error changing user status:", error)
    return {
      success: false,
      message: "An error occurred while changing the user status",
    }
  }
}

// Bulk change user status
export async function bulkChangeUserStatus(
  userIds: string[],
  status: "active" | "inactive",
): Promise<{ success: boolean; message: string }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Update status for each user
    for (const userId of userIds) {
      const userIndex = dummyUsers.findIndex((user) => user.id === userId)
      if (userIndex !== -1) {
        dummyUsers[userIndex].status = status
        dummyUsers[userIndex].updatedAt = new Date().toISOString()
      }
    }

    revalidatePath("/users")
    return {
      success: true,
      message: `${userIds.length} users ${status === "active" ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    console.error("Error changing user status:", error)
    return {
      success: false,
      message: "An error occurred while changing the user status",
    }
  }
}

// Bulk delete users
export async function bulkDeleteUsers(userIds: string[]): Promise<{ success: boolean; message: string }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Delete each user
    let deletedCount = 0
    for (const userId of userIds) {
      const userIndex = dummyUsers.findIndex((user) => user.id === userId)
      if (userIndex !== -1) {
        dummyUsers.splice(userIndex, 1)
        deletedCount++
      }
    }

    revalidatePath("/users")
    return {
      success: true,
      message: `${deletedCount} users deleted successfully`,
    }
  } catch (error) {
    console.error("Error deleting users:", error)
    return {
      success: false,
      message: "An error occurred while deleting the users",
    }
  }
}

// Export users data
export async function exportUsers(params: {
  search?: string
  role?: string
  status?: string
  fromDate?: string
  toDate?: string
  format?: "csv" | "pdf"
}): Promise<{ success: boolean; message: string; url?: string }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Get filtered users
    let users = getUsersFromDB()

    // Apply search filter
    if (params.search) {
      const query = params.search.toLowerCase()
      users = users.filter(
        (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
    }

    // Apply role filter
    if (params.role && params.role !== "all") {
      users = users.filter((user) => user.role === params.role)
    }

    // Apply status filter
    if (params.status && params.status !== "all") {
      users = users.filter((user) => user.status === params.status)
    }

    // Apply date range filter
    if (params.fromDate) {
      const fromDate = new Date(params.fromDate)
      users = users.filter((user) => new Date(user.createdAt) >= fromDate)
    }

    if (params.toDate) {
      const toDate = new Date(params.toDate)
      users = users.filter((user) => new Date(user.createdAt) <= toDate)
    }

    // In a real app, this would generate a file and return a URL
    return {
      success: true,
      message: `${users.length} users exported successfully`,
      url: `/api/exports/users-${Date.now()}.${params.format || "csv"}`,
    }
  } catch (error) {
    console.error("Error exporting users:", error)
    return {
      success: false,
      message: "An error occurred while exporting the users",
    }
  }
}
