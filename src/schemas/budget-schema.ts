import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const budgetItemSchema = z.object({
  _id: objectIdSchema.optional(),
  title: z.string().trim().min(1, 'Item title required').max(200),
  amountCents: z.number().int().min(0, 'Amount must be positive'),
});

export const createBudgetSchema = z.object({
  projectId: objectIdSchema,
  venueName: z.string().trim().min(1, 'Venue name required').max(200),
  items: z.array(budgetItemSchema).default([]),
});

export const updateBudgetSchema = createBudgetSchema.partial().extend({
  _id: objectIdSchema,
});

export type BudgetItemInput = z.infer<typeof budgetItemSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
