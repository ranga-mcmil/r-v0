import { Suspense } from "react"
import { ProductEditClient } from "./product-edit-client"
import Loading from "./loading"

// This is a server component that will handle the suspense boundary
export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductEditClient params={params} />
    </Suspense>
  )
}
