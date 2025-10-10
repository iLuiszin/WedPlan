import { BudgetModel, type IBudget } from '@/models/budget';
import {
  serializeDocuments,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function findBudgetsByProject(projectId: string): Promise<SerializedDocument<IBudget>[]> {
  const budgets = await BudgetModel.find()
    .where('projectId')
    .equals(projectId)
    .sort({ createdAt: -1 })
    .exec();

  return serializeDocuments<IBudget>(budgets as unknown as MongooseDocument<IBudget>[]);
}
