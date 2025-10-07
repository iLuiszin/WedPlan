'use server';

import { revalidatePath } from 'next/cache';
import type { Document } from 'mongoose';
import { BudgetModel } from '@/models/budget';
import { createBudgetSchema, updateBudgetSchema } from '@/schemas/budget-schema';
import { connectToDatabase } from '@/lib/db';
import type { ActionResponse } from '@/types/action-response';
import type { IBudget } from '@/models/budget';

function serializeBudget(budget: Document & IBudget): IBudget {
  return JSON.parse(JSON.stringify(budget.toObject()));
}

export async function createBudgetAction(input: unknown): Promise<ActionResponse<IBudget>> {
  const parsed = createBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const budget = await BudgetModel.create(parsed.data);
    revalidatePath('/budgets');
    return { success: true, data: serializeBudget(budget) };
  } catch (error) {
    console.error('Error creating budget:', error);
    return { success: false, error: 'Failed to create budget', code: 'DB_ERROR' };
  }
}

export async function updateBudgetAction(input: unknown): Promise<ActionResponse<IBudget>> {
  const parsed = updateBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    const { _id, ...updates } = parsed.data;
    //@ts-expect-error - Mongoose typing complexity
    const budget = await BudgetModel.findByIdAndUpdate(_id, updates, { new: true });
    if (!budget) {
      return { success: false, error: 'Budget not found', code: 'NOT_FOUND' };
    }
    revalidatePath('/budgets');
    return { success: true, data: serializeBudget(budget) };
  } catch (error) {
    console.error('Error updating budget:', error);
    return { success: false, error: 'Failed to update budget', code: 'DB_ERROR' };
  }
}

export async function deleteBudgetAction(id: string): Promise<ActionResponse<void>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const budget = await BudgetModel.findById(id);
    if (!budget) {
      return { success: false, error: 'Budget not found', code: 'NOT_FOUND' };
    }

    //@ts-expect-error - Mongoose typing complexity
    await BudgetModel.findByIdAndDelete(id);
    revalidatePath('/budgets');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting budget:', error);
    return { success: false, error: 'Failed to delete budget', code: 'DB_ERROR' };
  }
}

export async function getBudgetsAction(projectId: string): Promise<ActionResponse<IBudget[]>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const budgets = await BudgetModel.find({ projectId }).sort({ createdAt: -1 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, data: budgets.map((b: any) => serializeBudget(b)) };
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return { success: false, error: 'Failed to fetch budgets', code: 'DB_ERROR' };
  }
}
