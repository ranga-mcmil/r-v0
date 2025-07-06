"use client"

import { useEffect, useState } from "react"
import { CustomerForm } from "@/components/customer-form"
import { customers } from "@/lib/dummy-data"

export default function EditCustomerPage({ params }) {
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    // Find the customer by ID
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const foundCustomer = customers.find((c) => c.id.toString() === id)

    if (foundCustomer) {
      setCustomer(foundCustomer)
    }
  }, [params.id])

  // No loading spinner here, we'll just render the form with null customer
  // until the data is loaded, and the skeleton loading.tsx will handle the loading state
  return <CustomerForm customer={customer} />
}
