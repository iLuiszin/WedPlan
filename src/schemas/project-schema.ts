import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const MAX_DATE = new Date('2100-12-31T23:59:59.999Z');

export const createProjectSchema = z.object({
  slug: z.string().trim().min(1).max(120).optional(),
  brideFirstName: z
    .string()
    .trim()
    .min(1, 'Nome da noiva é obrigatório')
    .max(100, 'Nome da noiva muito longo'),
  brideLastName: z
    .string()
    .trim()
    .min(1, 'Sobrenome da noiva é obrigatório')
    .max(100, 'Sobrenome da noiva muito longo'),
  groomFirstName: z
    .string()
    .trim()
    .min(1, 'Nome do noivo é obrigatório')
    .max(100, 'Nome do noivo muito longo'),
  groomLastName: z
    .string()
    .trim()
    .min(1, 'Sobrenome do noivo é obrigatório')
    .max(100, 'Sobrenome do noivo muito longo'),
  weddingDate: z
    .date()
    .min(getTodayStart(), 'A data do casamento não pode ser no passado')
    .max(MAX_DATE, 'A data do casamento deve ser antes de 2100')
    .nullable()
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  _id: objectIdSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
