/**
 * reports/types.ts
 * 
 * This file contains the TypeScript type definitions for report-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { 
  SalesDetailReportParamsSchema, 
  SalesDetailReportPaginatedParamsSchema, 
  SalesDetailReportDateRangeParamsSchema 
} from './schema';

// Schema-derived types
export type SalesDetailReportParams = z.infer<typeof SalesDetailReportParamsSchema>;
export type SalesDetailReportPaginatedParams = z.infer<typeof SalesDetailReportPaginatedParamsSchema>;
export type SalesDetailReportDateRangeParams = z.infer<typeof SalesDetailReportDateRangeParamsSchema>;

// Response types from API based on OpenAPI spec
export interface SalesDetailReportResponse {
  date: string;
  productName: string;
  customerName: string;
  width: number;
  length: number;
  weight: number;
  quantitySold: number;
  total: number;
  billToAddress: string;
  customerPhoneNumber: string;
  branchName: string;
  paymentType: string;
  unitOfMeasure: string;
  dimensions: string;
  measurement: string;
  calculatedArea: number;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// API Response types
export type GetSalesDetailReportResponse = SalesDetailReportResponse[];
export type GetSalesDetailReportPaginatedResponse = PaginationResponse<SalesDetailReportResponse>;
export type GetSalesDetailReportDateRangeResponse = SalesDetailReportResponse[];