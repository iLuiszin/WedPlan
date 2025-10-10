import type { IBudget, IBudgetItem, ICategory, IProvider, ICategoryField } from '@/models/budget';
import type { SerializedDocument } from '@/types/mongoose-helpers';

export type SerializedBudget = SerializedDocument<IBudget>;

export type { IBudget, IBudgetItem, ICategory, IProvider, ICategoryField };
export type {
  CreateBudgetInput,
  UpdateBudgetInput,
} from '@/schemas/budget-schema';
