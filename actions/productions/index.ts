'use server';

import { authOptions } from "@/lib/auth/next-auth-options";
import { APIResponse } from "@/lib/http-service/apiClient";
import { productionService } from "@/lib/http-service/productions";
import { CreateProductionSchema } from "@/lib/http-service/productions/schema";
import { 
  CreateProductionPayload, 
  CreateProductionResponse, 
  GetProductionsByBatchResponse,
  GetProductionsByBranchResponse,
  ProductionPaginationParams
} from "@/lib/http-service/productions/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createProductionAction(
  formData: FormData, 
  orderId: number, 
  inventoryId: number
): Promise<APIResponse<CreateProductionResponse, CreateProductionPayload>> {
  const rawData: CreateProductionPayload = {
    quantity: parseFloat(formData.get('quantity') as string),
    remarks: formData.get('remarks') as string || undefined,
  }

  // Validate the form data
  const validatedData = CreateProductionSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Please fix the errors in the form',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      inputData: rawData
    }
  }

  const res = await productionService.createProduction(
    orderId, 
    inventoryId, 
    validatedData.data as CreateProductionPayload
  );

  if (res.success) {
    revalidatePath('/productions');
    revalidatePath(`/orders/${orderId}/productions`);
    revalidatePath(`/inventory/${inventoryId}/productions`);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/inventory`);
    return {
      success: true,
      data: res.data,
    };
  } else {
    return {
      success: false,
      error: res.error,
      inputData: rawData
    }
  }
}

export async function getProductionsByBatchAction(
  batchId: number, 
  params?: ProductionPaginationParams
): Promise<APIResponse<GetProductionsByBatchResponse>> {
  return await productionService.getProductionsByBatch(batchId, params);
}


/**
 * Get productions by batch with revalidation - useful for pages that need fresh data
 */
export async function getProductionsByBatchWithRevalidationAction(
  batchId: number, 
  params?: ProductionPaginationParams
): Promise<APIResponse<GetProductionsByBatchResponse>> {
  const res = await productionService.getProductionsByBatch(batchId, params);
  
  if (res.success) {
    revalidatePath('/productions');
    revalidatePath(`/batches/${batchId}/productions`);
  }
  
  return res;
}

/**
 * Helper action to create production and refresh all related data
 */
export async function createProductionWithFullRevalidationAction(
  formData: FormData, 
  orderId: number, 
  inventoryId: number,
  batchId?: number
): Promise<APIResponse<CreateProductionResponse, CreateProductionPayload>> {
  const result = await createProductionAction(formData, orderId, inventoryId);
  
  if (result.success && batchId) {
    // Additional revalidation for batch-related pages
    revalidatePath(`/batches/${batchId}/productions`);
    revalidatePath(`/batches/${batchId}`);
  }
  
  return result;
}


export async function getProductionsByBranchIdAction(
  params?: ProductionPaginationParams
): Promise<APIResponse<GetProductionsByBranchResponse>> {
  // Get session to determine branchId
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // For non-admin users, use their assigned branch
  let branchId: string;
  if (session.user.role !== 'ROLE_ADMIN') {
    if (!session.user.branchId) {
      return {
        success: false,
        error: 'You must be assigned to a branch to view productions',
      };
    }
    branchId = session.user.branchId;
  } else {
    return {
      success: false,
      error: 'Admin users must specify a branch ID',
    };
  }

  return await productionService.getProductionsByBranchId(branchId, params);
}


/**
 * Get productions by branch ID with revalidation - useful for pages that need fresh data
 */
export async function getProductionsByBranchIdWithRevalidationAction(
  params?: ProductionPaginationParams
): Promise<APIResponse<GetProductionsByBranchResponse>> {
  // Get session to determine branchId
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  // For non-admin users, use their assigned branch
  let branchId: string;
  if (session.user.role !== 'ROLE_ADMIN') {
    if (!session.user.branchId) {
      return {
        success: false,
        error: 'You must be assigned to a branch to view productions',
      };
    }
    branchId = session.user.branchId;
  } else {
    return {
      success: false,
      error: 'Admin users must specify a branch ID',
    };
  }

  const res = await productionService.getProductionsByBranchId(branchId, params);
  
  if (res.success) {
    revalidatePath('/productions');
    revalidatePath(`/branches/${branchId}/productions`);
  }
  
  return res;
}