import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const budgetItemSchema = z.object({
  _id: objectIdSchema.optional(),
  title: z.string().trim().min(1, 'Título do item é obrigatório').max(200, 'Título muito longo'),
  amountCents: z.number().int().min(0, 'Valor deve ser positivo'),
});

export const categoryFieldSchema = z.object({
  _id: objectIdSchema.optional(),
  key: z.string().trim().min(1, 'Nome do campo é obrigatório').max(100, 'Nome muito longo'),
  value: z.string().trim().max(500, 'Valor muito longo'),
  fieldType: z.enum(['text', 'number', 'currency', 'date']).default('text'),
  itemType: z.enum(['information', 'expense']).default('information'),
});

export const providerSchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().trim().min(1, 'Nome do fornecedor é obrigatório').max(200, 'Nome muito longo'),
  fields: z.array(categoryFieldSchema).default([]),
  notes: z.string().trim().max(1000, 'Notas muito longas').default(''),
  amountCents: z.number().int().min(0, 'Valor deve ser positivo').default(0),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const categorySchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().trim().min(1, 'Nome da categoria é obrigatório').max(100, 'Nome muito longo'),
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
