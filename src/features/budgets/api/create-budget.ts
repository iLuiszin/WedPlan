import { BudgetModel, type IBudget } from '@/models/budget';
import type { CreateBudgetInput } from '@/schemas/budget-schema';
import {
  serializeDocument,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function createBudget(data: CreateBudgetInput): Promise<SerializedDocument<IBudget>> {
  const budget = await BudgetModel.create(data);
  return serializeDocument<IBudget>(budget as unknown as MongooseDocument<IBudget>);
}
