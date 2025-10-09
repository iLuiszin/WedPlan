'use server';

import { revalidatePath } from 'next/cache';
import { createBudgetSchema, updateBudgetSchema } from '@/schemas/budget-schema';
import type { ActionResponse } from '@/types/action-response';
import type { IBudget } from '@/models/budget';
import { BudgetRepository } from '@/repositories/budget-repository';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/types/error-codes';
import type { SerializedDocument } from '@/types/mongoose-helpers';

const budgetRepository = new BudgetRepository();

export async function createBudgetAction(
  input: unknown
): Promise<ActionResponse<SerializedDocument<IBudget>>> {
  const parsed = createBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const budget = await budgetRepository.create(parsed.data);
    revalidatePath('/budgets');
    return { success: true, data: budget };
  } catch (error) {
    logger.error('Failed to create budget', error as Error, { input: parsed.data });
    return { success: false, error: 'Failed to create budget', code: ErrorCode.DB_ERROR };
  }
}

export async function updateBudgetAction(
  input: unknown
): Promise<ActionResponse<SerializedDocument<IBudget>>> {
  const parsed = updateBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const { _id, ...updates } = parsed.data;
    const budget = await budgetRepository.update(_id, updates);

    if (!budget) {
      return { success: false, error: 'Budget not found', code: ErrorCode.NOT_FOUND };
    }

    revalidatePath('/budgets');
    return { success: true, data: budget };
  } catch (error) {
    logger.error('Failed to update budget', error as Error, { input: parsed.data });
    return { success: false, error: 'Failed to update budget', code: ErrorCode.DB_ERROR };
  }
}

export async function deleteBudgetAction(id: string): Promise<ActionResponse<void>> {
  try {
    const budget = await budgetRepository.findById(id);

    if (!budget) {
      return { success: false, error: 'Budget not found', code: ErrorCode.NOT_FOUND };
    }

    await budgetRepository.delete(id);
    revalidatePath('/budgets');
    return { success: true, data: undefined };
  } catch (error) {
    logger.error('Failed to delete budget', error as Error, { budgetId: id });
    return { success: false, error: 'Failed to delete budget', code: ErrorCode.DB_ERROR };
  }
}

export async function getBudgetsAction(
  projectId: string
): Promise<ActionResponse<SerializedDocument<IBudget>[]>> {
  try {
    const budgets = await budgetRepository.findByProject(projectId);
    return { success: true, data: budgets };
  } catch (error) {
    logger.error('Failed to fetch budgets', error as Error, { projectId });
    return { success: false, error: 'Failed to fetch budgets', code: ErrorCode.DB_ERROR };
  }
}
