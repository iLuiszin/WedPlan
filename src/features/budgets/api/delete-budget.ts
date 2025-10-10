import { BudgetModel } from '@/models/budget';

export async function deleteBudget(id: string): Promise<boolean> {
  const result = await BudgetModel.findByIdAndDelete(id).exec();
  return result !== null;
}
