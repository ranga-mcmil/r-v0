'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { reportService } from "@/lib/http-service/reports";
import { 
  SalesDetailReportParamsSchema, 
  SalesDetailReportPaginatedParamsSchema, 
  SalesDetailReportDateRangeParamsSchema 
} from "@/lib/http-service/reports/schema";
import { 
  SalesDetailReportParams,
  SalesDetailReportPaginatedParams,
  SalesDetailReportDateRangeParams,
  GetSalesDetailReportResponse,
  GetSalesDetailReportPaginatedResponse,
  GetSalesDetailReportDateRangeResponse
} from "@/lib/http-service/reports/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// =====================================
// SALES DETAIL REPORT ACTIONS
// =====================================

/**
 * Get sales detail report
 * Uses session branchId for non-admin users
 */
export async function getSalesDetailReportAction(date?: string): Promise<APIResponse<GetSalesDetailReportResponse>> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // Determine branchId from session
  let branchId: string | undefined;
  
  // For non-admin users, use their assigned branch
  if (session.user.role !== 'ROLE_ADMIN') {
    if (!session.user.branchId) {
      return {
        success: false,
        error: 'You must be assigned to a branch to view sales reports',
      };
    }
    branchId = session.user.branchId;
  }
  // Admin users get reports for all branches (no branchId filter)

  const params: SalesDetailReportParams = {
    ...(branchId && { branchId }),
    ...(date && { date })
  };

  // Validate parameters
  const validatedParams = SalesDetailReportParamsSchema.safeParse(params);
  
  if (!validatedParams.success) {
    return {
      success: false,
      error: 'Invalid parameters provided',
      fieldErrors: validatedParams.error.flatten().fieldErrors,
    };
  }

  return await reportService.getSalesDetailReport(validatedParams.data);
}

/**
 * Get paginated sales detail report
 * Uses session branchId for non-admin users
 */
export async function getSalesDetailReportPaginatedAction(
  date?: string,
  pageNo?: number,
  pageSize?: number
): Promise<APIResponse<GetSalesDetailReportPaginatedResponse>> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // Determine branchId from session
  let branchId: string | undefined;
  
  // For non-admin users, use their assigned branch
  if (session.user.role !== 'ROLE_ADMIN') {
    if (!session.user.branchId) {
      return {
        success: false,
        error: 'You must be assigned to a branch to view sales reports',
      };
    }
    branchId = session.user.branchId;
  }
  // Admin users get reports for all branches (no branchId filter)

  const params: SalesDetailReportPaginatedParams = {
    ...(branchId && { branchId }),
    ...(date && { date }),
    pageNo: pageNo ?? 0,
    pageSize: pageSize ?? 20
  };

  // Validate parameters
  const validatedParams = SalesDetailReportPaginatedParamsSchema.safeParse(params);
  
  if (!validatedParams.success) {
    return {
      success: false,
      error: 'Invalid parameters provided',
      fieldErrors: validatedParams.error.flatten().fieldErrors,
    };
  }

  return await reportService.getSalesDetailReportPaginated(validatedParams.data);
}

/**
 * Get sales detail report by date range
 * Uses session branchId for non-admin users
 */
export async function getSalesDetailReportByDateRangeAction(
  startDate: string,
  endDate: string
): Promise<APIResponse<GetSalesDetailReportDateRangeResponse>> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // Determine branchId from session
  let branchId: string | undefined;
  
  // For non-admin users, use their assigned branch
  if (session.user.role !== 'ROLE_ADMIN') {
    if (!session.user.branchId) {
      return {
        success: false,
        error: 'You must be assigned to a branch to view sales reports',
      };
    }
    branchId = session.user.branchId;
  }
  // Admin users get reports for all branches (no branchId filter)

  const params: SalesDetailReportDateRangeParams = {
    ...(branchId && { branchId }),
    startDate,
    endDate
  };

  // Validate parameters
  const validatedParams = SalesDetailReportDateRangeParamsSchema.safeParse(params);
  
  if (!validatedParams.success) {
    return {
      success: false,
      error: 'Invalid parameters provided',
      fieldErrors: validatedParams.error.flatten().fieldErrors,
    };
  }

  return await reportService.getSalesDetailReportByDateRange(validatedParams.data);
}

// =====================================
// ACTIONS WITH REVALIDATION
// =====================================

/**
 * Get sales detail report with revalidation
 */
export async function getSalesDetailReportWithRevalidationAction(date?: string): Promise<APIResponse<GetSalesDetailReportResponse>> {
  const res = await getSalesDetailReportAction(date);
  
  if (res.success) {
    revalidatePath('/reports');
    revalidatePath('/reports/sales');
  }
  
  return res;
}

/**
 * Get paginated sales detail report with revalidation
 */
export async function getSalesDetailReportPaginatedWithRevalidationAction(
  date?: string,
  pageNo?: number,
  pageSize?: number
): Promise<APIResponse<GetSalesDetailReportPaginatedResponse>> {
  const res = await getSalesDetailReportPaginatedAction(date, pageNo, pageSize);
  
  if (res.success) {
    revalidatePath('/reports');
    revalidatePath('/reports/sales');
  }
  
  return res;
}

/**
 * Get sales detail report by date range with revalidation
 */
export async function getSalesDetailReportByDateRangeWithRevalidationAction(
  startDate: string,
  endDate: string
): Promise<APIResponse<GetSalesDetailReportDateRangeResponse>> {
  const res = await getSalesDetailReportByDateRangeAction(startDate, endDate);
  
  if (res.success) {
    revalidatePath('/reports');
    revalidatePath('/reports/sales');
  }
  
  return res;
}

// =====================================
// FORM-BASED ACTIONS
// =====================================

/**
 * Get sales detail report from form data
 */
export async function getSalesDetailReportFromFormAction(formData: FormData): Promise<APIResponse<GetSalesDetailReportResponse>> {
  const date = formData.get('date') as string || undefined;
  return await getSalesDetailReportAction(date);
}

/**
 * Get sales detail report by date range from form data
 */
export async function getSalesDetailReportByDateRangeFromFormAction(formData: FormData): Promise<APIResponse<GetSalesDetailReportDateRangeResponse>> {
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  
  if (!startDate || !endDate) {
    return {
      success: false,
      error: 'Both start date and end date are required',
    };
  }
  
  return await getSalesDetailReportByDateRangeAction(startDate, endDate);
}