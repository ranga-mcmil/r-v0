/**
 * reports/index.ts
 * 
 * This file contains the ReportService class that implements API requests
 * to the report-controller endpoints.
 */

import { apiClient, APIResponse } from "@/lib/http-service/apiClient";
import { apiHeaderService } from "@/lib/http-service/apiHeaders";
import { BaseAPIRequests } from "@/lib/http-service/baseAPIRequests";
import { 
  SalesDetailReportParams,
  SalesDetailReportPaginatedParams,
  SalesDetailReportDateRangeParams,
  GetSalesDetailReportResponse,
  GetSalesDetailReportPaginatedResponse,
  GetSalesDetailReportDateRangeResponse
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";

export class ReportService extends BaseAPIRequests {

  /**
   * Get sales detail report
   * 
   * GET /api/reports/sales-detail
   */
  async getSalesDetailReport(params?: SalesDetailReportParams): Promise<APIResponse<GetSalesDetailReportResponse>> {
    const queryString = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    const url = queryString ? `/api/reports/sales-detail?${queryString}` : `/api/reports/sales-detail`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetSalesDetailReportResponse>(response);
    } catch (error) {
      console.error('Report Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get paginated sales detail report
   * 
   * GET /api/reports/sales-detail/paginated
   */
  async getSalesDetailReportPaginated(params?: SalesDetailReportPaginatedParams): Promise<APIResponse<GetSalesDetailReportPaginatedResponse>> {
    const defaultParams: SalesDetailReportPaginatedParams = {
      pageNo: 0,
      pageSize: 20
    };

    const queryParams = { ...defaultParams, ...params };
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/reports/sales-detail/paginated?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetSalesDetailReportPaginatedResponse>(response);
    } catch (error) {
      console.error('Report Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }

  /**
   * Get sales detail report by date range
   * 
   * GET /api/reports/sales-detail/date-range
   */
  async getSalesDetailReportByDateRange(params: SalesDetailReportDateRangeParams): Promise<APIResponse<GetSalesDetailReportDateRangeResponse>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const url = `/api/reports/sales-detail/date-range?${queryString}`;

    try {
      const session = await getServerSession(authOptions);
      const headers = await this.apiHeaders.getHeaders(session);
      const response = await this.client.get(url, { headers });
      return this.handleResponse<GetSalesDetailReportDateRangeResponse>(response);
    } catch (error) {
      console.error('Report Service request failed:', error);
      return {
        success: false,
        error: (error as Error).message || 'An unknown error occurred',
      };
    }
  }
}

export const reportService = new ReportService(apiClient, apiHeaderService);