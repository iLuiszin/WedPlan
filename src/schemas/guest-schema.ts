import { z } from 'zod';

export const GUEST_CATEGORIES = ['groom', 'bride', 'both'] as const;
export const GUEST_ROLES = ['guest', 'groomsman', 'bridesmaid'] as const;

export const guestCategoryEnum = z.enum(GUEST_CATEGORIES);
export const guestRoleEnum = z.enum(GUEST_ROLES);

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const baseGuestSchema = z.object({
  projectId: objectIdSchema,
  firstName: z.string().trim().min(1, 'First name required').max(100),
  lastName: z.string().trim().min(1, 'Last name required').max(100),
  category: guestCategoryEnum,
  role: guestRoleEnum,
  partnerId: objectIdSchema.nullable().optional(),
});

export const createGuestSchema = baseGuestSchema.extend({
  category: guestCategoryEnum.default('both'),
  role: guestRoleEnum.default('guest'),
});

export const updateGuestSchema = baseGuestSchema.partial().extend({
  _id: objectIdSchema,
});

export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type GuestCategory = z.infer<typeof guestCategoryEnum>;
export type GuestRole = z.infer<typeof guestRoleEnum>;
