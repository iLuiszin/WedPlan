import { BudgetModel, type IBudget } from '@/models/budget';
import {
  serializeDocument,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function findBudgetById(id: string): Promise<SerializedDocument<IBudget> | null> {
  const budget = await BudgetModel.findById(id).exec();

  if (!budget) {
    return null;
  }

  return serializeDocument<IBudget>(budget as unknown as MongooseDocument<IBudget>);
}
