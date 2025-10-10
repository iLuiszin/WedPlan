import { BudgetModel, type IBudget } from '@/models/budget';
import type { UpdateBudgetInput } from '@/schemas/budget-schema';
import {
  serializeDocument,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function updateBudget(
  id: string,
  updates: Omit<Partial<UpdateBudgetInput>, '_id'>
): Promise<SerializedDocument<IBudget> | null> {
  const budget = await BudgetModel.findByIdAndUpdate(id, updates, { new: true }).exec();

  if (!budget) {
    return null;
  }

  return serializeDocument<IBudget>(budget as unknown as MongooseDocument<IBudget>);
}
