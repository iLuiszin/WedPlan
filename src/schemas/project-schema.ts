import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createProjectSchema = z.object({
  brideFirstName: z.string().trim().min(1, 'Bride first name required').max(100),
  brideLastName: z.string().trim().min(1, 'Bride last name required').max(100),
  groomFirstName: z.string().trim().min(1, 'Groom first name required').max(100),
  groomLastName: z.string().trim().min(1, 'Groom last name required').max(100),
  weddingDate: z.date().nullable().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  _id: objectIdSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
