import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const budgetItemSchema = z.object({
  _id: objectIdSchema.optional(),
  title: z.string().trim().min(1, 'Item title required').max(200),
  amountCents: z.number().int().min(0, 'Amount must be positive'),
});

export const categoryFieldSchema = z.object({
  _id: objectIdSchema.optional(),
  key: z.string().trim().min(1, 'Field name required').max(100),
  value: z.string().trim().max(500),
  fieldType: z.enum(['text', 'number', 'currency', 'date']).default('text'),
});

export const providerSchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().trim().min(1, 'Provider name required').max(200),
  fields: z.array(categoryFieldSchema).default([]),
  notes: z.string().trim().max(1000).default(''),
  amountCents: z.number().int().min(0, 'Amount must be positive').default(0),
});

export const categorySchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().trim().min(1, 'Category name required').max(100),
  providers: z.array(providerSchema).default([]),
});

export const createBudgetSchema = z.object({
  projectId: objectIdSchema,
  items: z.array(budgetItemSchema).default([]),
  categories: z.array(categorySchema).default([]),
});

export const updateBudgetSchema = createBudgetSchema.partial().extend({
  _id: objectIdSchema,
});

export type BudgetItemInput = z.infer<typeof budgetItemSchema>;
export type CategoryFieldInput = z.infer<typeof categoryFieldSchema>;
export type ProviderInput = z.infer<typeof providerSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
