// app/(main)/users/components/export-button.tsx
import { ExportButton as BaseExportButton } from "@/components/actions/export-button"
import type { UserDTO } from "@/lib/http-service/users/types"

interface ExportButtonProps {
  users: UserDTO[]
}

export function ExportButton({ users }: ExportButtonProps) {
  const headers = ["ID", "First Name", "Last Name", "Email", "Role", "Branch", "Status"]
  
  // Transform users data to match headers
  const exportData = users.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role.replace('ROLE_', '').replace('_', ' '),
    branch: user.branchName || '',
    status: user.isActive ? 'Active' : 'Inactive',
  }))

  return (
    <BaseExportButton
      data={exportData}
      filename="users_export"
      headers={headers}
    />
  )
}