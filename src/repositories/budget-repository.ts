import { BudgetModel, type IBudget } from '@/models/budget';
import { connectToDatabase } from '@/lib/db';
import type { CreateBudgetInput, UpdateBudgetInput } from '@/schemas/budget-schema';
import {
  serializeDocument,
  serializeDocuments,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export class BudgetRepository {
  async findByProject(projectId: string): Promise<SerializedDocument<IBudget>[]> {
    await connectToDatabase();
    const budgets = await BudgetModel.find()
      .where('projectId')
      .equals(projectId)
      .sort({ createdAt: -1 })
      .exec();

    return serializeDocuments<IBudget>(budgets as unknown as MongooseDocument<IBudget>[]);
  }

  async findById(id: string): Promise<SerializedDocument<IBudget> | null> {
    await connectToDatabase();
    const budget = await BudgetModel.findById(id).exec();

    if (!budget) {
      return null;
    }

    return serializeDocument<IBudget>(budget as unknown as MongooseDocument<IBudget>);
  }

  async create(data: CreateBudgetInput): Promise<SerializedDocument<IBudget>> {
    await connectToDatabase();
    const budget = await BudgetModel.create(data);
    return serializeDocument<IBudget>(budget as unknown as MongooseDocument<IBudget>);
  }

  async update(
    id: string,
    updates: Omit<Partial<UpdateBudgetInput>, '_id'>
  ): Promise<SerializedDocument<IBudget> | null> {
    await connectToDatabase();
    const budget = await BudgetModel.findByIdAndUpdate(id, updates, { new: true }).exec();

    if (!budget) {
      return null;
    }

    return serializeDocument<IBudget>(budget as unknown as MongooseDocument<IBudget>);
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await BudgetModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
