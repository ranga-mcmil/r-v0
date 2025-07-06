import { Suspense } from "react"
import { UserEditClient } from "./user-edit-client"
import EditUserLoading from "./loading"

export default function EditUserPage({ params }) {
  return (
    <Suspense fallback={<EditUserLoading />}>
      <UserEditClient params={params} />
    </Suspense>
  )
}
