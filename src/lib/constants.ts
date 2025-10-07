// Guest categories
export const GUEST_CATEGORIES = {
  GROOM: 'groom',
  BRIDE: 'bride',
  BOTH: 'both',
} as const;

// Guest roles
export const GUEST_ROLES = {
  GUEST: 'guest',
  GROOMSMAN: 'groomsman',
  BRIDESMAID: 'bridesmaid',
} as const;

// Category labels (Portuguese)
export const CATEGORY_LABELS = {
  [GUEST_CATEGORIES.GROOM]: 'Noivo',
  [GUEST_CATEGORIES.BRIDE]: 'Noiva',
  [GUEST_CATEGORIES.BOTH]: 'Ambos',
} as const;

// Role labels (Portuguese)
export const ROLE_LABELS = {
  [GUEST_ROLES.GUEST]: 'Convidado',
  [GUEST_ROLES.GROOMSMAN]: 'Padrinho',
  [GUEST_ROLES.BRIDESMAID]: 'Madrinha',
} as const;
