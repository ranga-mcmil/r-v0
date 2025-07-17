'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { dashboardService } from "@/lib/http-service/dashboard";
import { DashboardParamsSchema } from "@/lib/http-service/dashboard/schema";
import { 
  DashboardParams,
  GetDashboardResponse
} from "@/lib/http-service/dashboard/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getDashboardAction(): Promise<APIResponse<GetDashboardResponse>> {
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
        error: 'You must be assigned to a branch to view dashboard data',
      };
    }
    branchId = session.user.branchId;
  }
  // Admin users get dashboard data for all branches (no branchId filter)

  // Validate branchId if present
  if (branchId) {
    const validatedParams = DashboardParamsSchema.safeParse({ branchId });
    
    if (!validatedParams.success) {
      return {
        success: false,
        error: 'Invalid branch ID from session',
        fieldErrors: validatedParams.error.flatten().fieldErrors,
      };
    }
  }

  return await dashboardService.getDashboard(branchId ? { branchId } : undefined);
}

export async function getDashboardWithRevalidationAction(): Promise<APIResponse<GetDashboardResponse>> {
  const res = await getDashboardAction();
  
  if (res.success) {
    revalidatePath('/dashboard');
    revalidatePath('/');
  }
  
  return res;
}

/**
 * Get dashboard data for current user's branch (for non-admin users)
 */
export async function getCurrentUserDashboardAction(): Promise<APIResponse<GetDashboardResponse>> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // Admin users need to specify a branch
  if (session.user.role === 'ROLE_ADMIN') {
    return {
      success: false,
      error: 'Admin users must specify a branch ID to view dashboard data',
    };
  }

  // Use the user's assigned branch
  if (!session.user.branchId) {
    return {
      success: false,
      error: 'You must be assigned to a branch to view dashboard data',
    };
  }

  return await dashboardService.getDashboard({ branchId: session.user.branchId });
}

/**
 * Get dashboard data for a specific branch (admin only)
 */
export async function getBranchDashboardAction(branchId: string): Promise<APIResponse<GetDashboardResponse>> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // Only admin users can view dashboard for any branch
  if (session.user.role !== 'ROLE_ADMIN') {
    return {
      success: false,
      error: 'Only admin users can view dashboard data for specific branches',
    };
  }

  // Validate branch ID
  const validatedParams = DashboardParamsSchema.safeParse({ branchId });
  
  if (!validatedParams.success) {
    return {
      success: false,
      error: 'Invalid branch ID provided',
      fieldErrors: validatedParams.error.flatten().fieldErrors,
    };
  }

  return await dashboardService.getDashboard({ branchId });
}