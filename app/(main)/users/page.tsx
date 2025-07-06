import { UsersPageClient } from "./components/users-page-client"
import type { User, UserRole } from "@/lib/types"

interface UsersPageProps {
  searchParams: {
    search?: string
    role?: string
    status?: string
    fromDate?: string
    toDate?: string
    sortField?: string
    sortDirection?: "asc" | "desc"
    page?: string
  }
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  // Parse search params
  const search = searchParams.search || ""
  const role = searchParams.role || "all"
  const status = searchParams.status || "all"
  const fromDate = searchParams.fromDate
  const toDate = searchParams.toDate
  const sortField = searchParams.sortField || "name"
  const sortDirection = (searchParams.sortDirection as "asc" | "desc") || "asc"
  const page = Number.parseInt(searchParams.page || "1", 10)

  // Create base URL for pagination and sorting
  const baseUrl = `/users?${new URLSearchParams({
    ...(search ? { search } : {}),
    ...(role !== "all" ? { role } : {}),
    ...(status !== "all" ? { status } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
    ...(sortField !== "name" ? { sortField } : {}),
    ...(sortDirection !== "asc" ? { sortDirection } : {}),
  }).toString()}`

  // Get users data directly (no server action)
  // In a real app, this would be a database query
  const dummyUsers: User[] = [
    {
      id: "1",
      name: "John Admin",
      email: "admin@roofstar.com",
      role: "admin" as UserRole,
      status: "active",
      createdAt: "2023-01-15T08:00:00Z",
      updatedAt: "2023-04-20T14:30:00Z",
      lastLogin: "2023-05-01T09:15:00Z",
    },
    {
      id: "2",
      name: "Sarah Manager",
      email: "sarah@roofstar.com",
      role: "store_manager" as UserRole,
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
      role: "sales_rep" as UserRole,
      status: "active",
      createdAt: "2023-03-05T09:30:00Z",
      updatedAt: "2023-04-10T13:15:00Z",
      lastLogin: "2023-04-29T14:10:00Z",
    },
    {
      id: "4",
      name: "Lisa Manager",
      email: "lisa@roofstar.com",
      role: "store_manager" as UserRole,
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
      role: "sales_rep" as UserRole,
      status: "active",
      createdAt: "2023-02-25T14:20:00Z",
      updatedAt: "2023-04-18T15:10:00Z",
      lastLogin: "2023-04-28T11:30:00Z",
    },
  ]

  // Apply filters
  let filteredUsers = [...dummyUsers]

  // Apply search filter
  if (search) {
    const query = search.toLowerCase()
    filteredUsers = filteredUsers.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )
  }

  // Apply role filter
  if (role !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role === role)
  }

  // Apply status filter
  if (status !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.status === status)
  }

  // Apply date range filter (based on createdAt)
  if (fromDate) {
    const fromDateObj = new Date(fromDate)
    filteredUsers = filteredUsers.filter((user) => {
      const createdDate = new Date(user.createdAt)
      return createdDate >= fromDateObj
    })
  }

  if (toDate) {
    const toDateObj = new Date(toDate)
    filteredUsers = filteredUsers.filter((user) => {
      const createdDate = new Date(user.createdAt)
      return createdDate <= toDateObj
    })
  }

  // Apply sorting
  filteredUsers.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
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

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  // Calculate pagination
  const itemsPerPage = 10
  const totalUsers = filteredUsers.length
  const totalPages = Math.ceil(totalUsers / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Calculate stats
  const activeUsers = filteredUsers.filter((user) => user.status === "active").length
  const adminCount = filteredUsers.filter((user) => user.role === "admin").length
  const managerCount = filteredUsers.filter((user) => user.role === "store_manager").length
  const salesRepCount = filteredUsers.filter((user) => user.role === "sales_rep").length

  return (
    <UsersPageClient
      users={paginatedUsers}
      totalUsers={totalUsers}
      activeUsers={activeUsers}
      adminCount={adminCount}
      managerCount={managerCount}
      salesRepCount={salesRepCount}
      currentPage={page}
      totalPages={totalPages}
      sortField={sortField}
      sortDirection={sortDirection}
      baseUrl={baseUrl}
      search={search}
      role={role}
      status={status}
      fromDate={fromDate}
      toDate={toDate}
    />
  )
}
