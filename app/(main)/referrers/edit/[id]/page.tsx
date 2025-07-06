import { Suspense } from "react"
import { ReferrerEditClient } from "./referrer-edit-client"
import EditReferrerLoading from "./loading"

export default function EditReferrerPage({ params }) {
  return (
    <Suspense fallback={<EditReferrerLoading />}>
      <ReferrerEditClient params={params} />
    </Suspense>
  )
}
