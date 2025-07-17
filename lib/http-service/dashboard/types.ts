/**
 * dashboard/types.ts
 * 
 * This file contains the TypeScript type definitions for dashboard-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { DashboardParamsSchema } from './schema';

// Schema-derived types
export type DashboardParams = z.infer<typeof DashboardParamsSchema>;

// Response types from API based on OpenAPI spec
export interface RecentSalesResponseDTO {
  id: number;
  orderNumber: string;
  orderType: string;
  status: string;
  paidAmount: number;
  transactionTime: string;
}

export interface DashboardResponseDTO {
  saleCount: number;
  productCount: number;
  customerCount: number;
  referralCount: number;
  recentSales: RecentSalesResponseDTO[];
}

// API Response types
export type GetDashboardResponse = DashboardResponseDTO;