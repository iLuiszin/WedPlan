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

// Guest filter options
export const GUEST_FILTERS = {
  ALL: 'all',
  GROOM: 'groom',
  BRIDE: 'bride',
  BOTH: 'both',
  GROOMSMEN: 'groomsmen',
  BRIDESMAIDS: 'bridesmaids',
  COUPLES: 'couples',
} as const;

export type GuestFilter = typeof GUEST_FILTERS[keyof typeof GUEST_FILTERS];

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

// Filter labels (Portuguese)
export const FILTER_LABELS = {
  [GUEST_FILTERS.ALL]: 'Todos',
  [GUEST_FILTERS.GROOM]: 'Noivo',
  [GUEST_FILTERS.BRIDE]: 'Noiva',
  [GUEST_FILTERS.BOTH]: 'Ambos',
  [GUEST_FILTERS.GROOMSMEN]: 'Padrinhos',
  [GUEST_FILTERS.BRIDESMAIDS]: 'Madrinhas',
  [GUEST_FILTERS.COUPLES]: 'Casais',
} as const;

// Budget field types
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  CURRENCY: 'currency',
  DATE: 'date',
} as const;

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];

// Field type labels (Portuguese)
export const FIELD_TYPE_LABELS = {
  [FIELD_TYPES.TEXT]: 'Texto',
  [FIELD_TYPES.NUMBER]: 'Número',
  [FIELD_TYPES.CURRENCY]: 'Moeda',
  [FIELD_TYPES.DATE]: 'Data',
} as const;

// Default category suggestions
export const DEFAULT_BUDGET_CATEGORIES = [
  'Buffet',
  'Local',
  'Vestimentas',
  'Decoração',
  'Fotografia',
  'Música',
  'Convites',
  'Flores',
  'Transporte',
  'Outros',
] as const;
