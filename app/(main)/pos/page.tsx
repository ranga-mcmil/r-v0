// app/(main)/pos/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { getProductsAction } from "@/actions/products"
import { getCustomersAction } from "@/actions/customers"
import { getCategoriesAction } from "@/actions/categories"
import { USER_ROLES } from "@/lib/types"
import { POSClient } from "./components/pos-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface POSPageProps {
  searchParams: {
    search?: string
    category?: string
  }
}

export default async function POSPage({ searchParams }: POSPageProps) {
  // Get session for role-based access
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Restrict to Sales Rep only
  if (session.user.role !== USER_ROLES.SALES_REP) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            The Point of Sale system is only available to Sales Representatives.
            {session.user.role === USER_ROLES.ADMIN && " As an Admin, please use the main dashboard to manage the system."}
            {session.user.role === USER_ROLES.MANAGER && " As a Manager, please use the reports and management sections."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // For SALES_REP, only show products from their branch
  const branchFilter = session.user.branchId ? { branchId: session.user.branchId } : undefined

  // Fetch data server-side using existing actions
  let products: any[] = []
  let customers: any[] = []
  let categories: any[] = []
  let hasErrors = false
  
  try {
    const [productsResponse, customersResponse, categoriesResponse] = await Promise.all([
      getProductsAction({ pageNo: 0, pageSize: 100, ...branchFilter }),
      getCustomersAction({ pageNo: 0, pageSize: 100 }),
      getCategoriesAction()
    ])
    
    products = (productsResponse.success && productsResponse.data) ? productsResponse.data.content : []
    customers = (customersResponse.success && customersResponse.data) ? customersResponse.data.content : []
    categories = (categoriesResponse.success && categoriesResponse.data) ? categoriesResponse.data : []

    // Check if any critical data failed to load
    if (!productsResponse.success || !customersResponse.success || !categoriesResponse.success) {
      hasErrors = true
    }
  } catch (error) {
    console.error('Error loading POS data:', error)
    hasErrors = true
  }

  return (
    <POSClient
      initialProducts={products}
      initialCustomers={customers}
      categories={categories}
      userBranch={session.user.branchId}
      searchParams={searchParams}
      hasInitialErrors={hasErrors}
    />
  )
}