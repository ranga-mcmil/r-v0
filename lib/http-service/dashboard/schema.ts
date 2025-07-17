/**
 * dashboard/schema.ts
 * 
 * This file contains the Zod validation schemas for dashboard-related data.
 */

import { z } from 'zod';

export const DashboardParamsSchema = z.object({
  branchId: z.string().uuid({ message: 'Branch ID must be a valid UUID' }).optional(),
});