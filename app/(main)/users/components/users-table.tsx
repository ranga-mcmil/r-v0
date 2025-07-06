"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, RefreshCw, Trash2, UserCheck, UserMinus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User, UserRole } from "@/lib/types"
import { deleteUser, changeUserStatus, bulkDeleteUsers, bulkChangeUserStatus } from "../actions"

interface UsersTableProps {
  users: User[]
  currentPage: number
  totalPages: number
  sortField?: string
  sortDirection?: "asc" | "desc"
  baseUrl: string
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  sortField = "name",
  sortDirection = "asc",
  baseUrl,
}: UsersTableProps) {
  const router = useRouter()
  const { toast } = useToast()

  // State for dialogs and actions
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Create URL for sorting
  const createSortURL = (field: string) => {
    const url = new URL(baseUrl, window.location.origin)
    const params = new URLSearchParams(url.search)

    if (sortField === field) {
      params.set("sortDirection", sortDirection === "asc" ? "desc" : "asc")
    } else {
      params.set("sortField", field)
      params.set("sortDirection", "asc")
    }

    url.search = params.toString()
    return url.pathname + url.search
  }

  // Handle item selection
  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle delete user
  const confirmDelete = (userId: string) => {
    setUserToDelete(userId)
    setShowDeleteDialog(true)
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return

    setIsProcessing(true)
    deleteUser(userToDelete)
      .then((result) => {
        if (result.success) {
          toast({
            title: "User deleted",
            description: result.message,
          })
          router.refresh()
        } else {
          toast({
            title: "Delete failed",
            description: result.message,
            variant: "destructive",
          })
        }
      })
      .catch((error) => {
        toast({
          title: "Delete failed",
          description: "An error occurred while deleting the user",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsProcessing(false)
        setUserToDelete(null)
        setShowDeleteDialog(false)
      })
  }

  // Handle status change
  const toggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    setIsProcessing(true)
    changeUserStatus(userId, newStatus as "active" | "inactive")
      .then((result) => {
        if (result.success) {
          toast({
            title: "User status updated",
            description: result.message,
          })
          router.refresh()
        } else {
          toast({
            title: "Update failed",
            description: result.message,
            variant: "destructive",
          })
        }
      })
      .catch((error) => {
        toast({
          title: "Update failed",
          description: "An error occurred while updating the user status",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user",
      })
      return
    }

    setBulkAction("")
    setShowBulkActionDialog(true)
  }

  const executeBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return

    setIsProcessing(true)

    if (bulkAction === "delete") {
      bulkDeleteUsers(selectedUsers)
        .then((result) => {
          if (result.success) {
            toast({
              title: "Users deleted",
              description: result.message,
            })
            router.refresh()
          } else {
            toast({
              title: "Delete failed",
              description: result.message,
              variant: "destructive",
            })
          }
        })
        .catch((error) => {
          toast({
            title: "Delete failed",
            description: "An error occurred while deleting the users",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsProcessing(false)
          setSelectedUsers([])
          setSelectAll(false)
          setShowBulkActionDialog(false)
          setBulkAction("")
        })
    } else if (bulkAction === "activate" || bulkAction === "deactivate") {
      bulkChangeUserStatus(selectedUsers, bulkAction === "activate" ? "active" : "inactive")
        .then((result) => {
          if (result.success) {
            toast({
              title: "Users updated",
              description: result.message,
            })
            router.refresh()
          } else {
            toast({
              title: "Update failed",
              description: result.message,
              variant: "destructive",
            })
          }
        })
        .catch((error) => {
          toast({
            title: "Update failed",
            description: "An error occurred while updating the users",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsProcessing(false)
          setSelectedUsers([])
          setSelectAll(false)
          setShowBulkActionDialog(false)
          setBulkAction("")
        })
    }
  }

  // Get role badge color
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "store_manager":
        return <Badge className="bg-blue-500">Store Manager</Badge>
      case "sales_rep":
        return <Badge className="bg-green-500">Sales Rep</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calculate pagination info
  const startIndex = (currentPage - 1) * 10 + 1
  const endIndex = Math.min(startIndex + users.length - 1, startIndex + 9)
  const totalItems = (currentPage - 1) * 10 + users.length

  return (
    <>
      {/* Bulk actions bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{selectedUsers.length}</span> users selected
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedUsers([])
                setSelectAll(false)
              }}
            >
              Clear Selection
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Bulk Actions"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction("activate")
                    handleBulkAction()
                  }}
                >
                  Activate Users
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction("deactivate")
                    handleBulkAction()
                  }}
                >
                  Deactivate Users
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    setBulkAction("delete")
                    handleBulkAction()
                  }}
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("name")} className="flex items-center hover:underline">
                  Name
                  {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("email")} className="flex items-center hover:underline">
                  Email
                  {sortField === "email" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("role")} className="flex items-center hover:underline">
                  Role
                  {sortField === "role" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={createSortURL("status")} className="flex items-center hover:underline">
                  Status
                  {sortField === "status" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </Link>
              </TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>
                <Link href={createSortURL("lastLogin")} className="flex items-center hover:underline">
                  Last Login
                  {sortField === "lastLogin" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </Link>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No users found. Try adjusting your filters or create your first user.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.warehouseName || "N/A"}</TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}`}>
                            <Users className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/edit/${user.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          disabled={isProcessing}
                        >
                          {user.status === "active" ? (
                            <>
                              <UserMinus className="mr-2 h-4 w-4" /> Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(user.id)}
                          className="text-destructive focus:text-destructive"
                          disabled={isProcessing}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex} to {endIndex} of {totalItems} users
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
              <Link href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${currentPage - 1}`}>Previous</Link>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild>
              <Link href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${currentPage + 1}`}>Next</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground"
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk action confirmation dialog */}
      <AlertDialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === "delete"
                ? `This will delete ${selectedUsers.length} users. This action cannot be undone.`
                : bulkAction === "activate"
                  ? `This will activate ${selectedUsers.length} users.`
                  : bulkAction === "deactivate"
                    ? `This will deactivate ${selectedUsers.length} users.`
                    : "Are you sure you want to perform this action?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              className={bulkAction === "delete" ? "bg-destructive text-destructive-foreground" : ""}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
