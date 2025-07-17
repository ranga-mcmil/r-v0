/**
 * dashboard/index.ts
 * 
 * This file contains the DashboardService class that implements API requests
 * to the dashboard-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  DashboardParams,
  GetDashboardResponse
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class DashboardService extends BaseAPIRequests {

  /**
   * Get dashboard data with optional branch filtering
   * 
   * GET /api/dashboard
   */
  async getDashboard(params?: DashboardParams): Promise<APIResponse<GetDashboardResponse>> {
    const queryString = params?.branchId 
      ? `?branchId=${encodeURIComponent(params.branchId)}`
      : '';
    
    const url = `/api/dashboard${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetDashboardResponse>(response);
    } catch (error) {
      console.error('Dashboard Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const dashboardService = new DashboardService(apiClient, apiHeaderService);