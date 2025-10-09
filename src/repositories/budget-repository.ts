import { BudgetModel, type IBudget } from '@/models/budget';
import { connectToDatabase } from '@/lib/db';
import type { SerializedDocument } from '@/types/mongoose-helpers';
import type { CreateBudgetInput, UpdateBudgetInput } from '@/schemas/budget-schema';

export class BudgetRepository {
  async findByProject(projectId: string): Promise<SerializedDocument<IBudget>[]> {
    await connectToDatabase();
    const budgets = await BudgetModel.find({ projectId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return JSON.parse(JSON.stringify(budgets)) as SerializedDocument<IBudget>[];
  }

  async findById(id: string): Promise<SerializedDocument<IBudget> | null> {
    await connectToDatabase();
    const budget = await BudgetModel.findById(id).lean().exec();

    if (!budget) {
      return null;
    }

    return JSON.parse(JSON.stringify(budget)) as SerializedDocument<IBudget>;
  }

  async create(data: CreateBudgetInput): Promise<SerializedDocument<IBudget>> {
    await connectToDatabase();
    const budget = await BudgetModel.create(data);
    const created = await BudgetModel.findById(budget._id).lean().exec();
    return JSON.parse(JSON.stringify(created)) as SerializedDocument<IBudget>;
  }

  async update(
    id: string,
    updates: Omit<Partial<UpdateBudgetInput>, '_id'>
  ): Promise<SerializedDocument<IBudget> | null> {
    await connectToDatabase();
    const budget = await BudgetModel.findByIdAndUpdate(id, updates, { new: true }).lean().exec();

    if (!budget) {
      return null;
    }

    return JSON.parse(JSON.stringify(budget)) as SerializedDocument<IBudget>;
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await BudgetModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
