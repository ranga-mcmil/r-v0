/**
 * reports/schema.ts
 * 
 * This file contains the Zod validation schemas for report-related data.
 */

import { z } from 'zod';

// Schema for sales detail report parameters
export const SalesDetailReportParamsSchema = z.object({
  branchId: z.string().uuid({ message: 'Branch ID must be a valid UUID' }).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

// Schema for paginated sales detail report parameters
export const SalesDetailReportPaginatedParamsSchema = z.object({
  branchId: z.string().uuid({ message: 'Branch ID must be a valid UUID' }).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  pageNo: z.number().int().min(0, 'Page number must be non-negative').default(0),
  pageSize: z.number().int().min(1, 'Page size must be at least 1').max(100, 'Page size cannot exceed 100').default(20),
});

// Schema for date range sales detail report parameters
export const SalesDetailReportDateRangeParamsSchema = z.object({
  branchId: z.string().uuid({ message: 'Branch ID must be a valid UUID' }).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
});