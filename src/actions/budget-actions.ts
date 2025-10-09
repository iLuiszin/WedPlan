'use server';

import { createBudgetSchema, updateBudgetSchema } from '@/schemas/budget-schema';
import { BudgetRepository } from '@/repositories/budget-repository';
import { AppError, ErrorCode } from '@/types/error-codes';
import { withAction, withValidatedAction } from '@/lib/action-wrapper';

const budgetRepository = new BudgetRepository();

export const createBudgetAction = withValidatedAction(
  async (input: typeof createBudgetSchema._output) => {
    return await budgetRepository.create(input);
  },
  {
    schema: createBudgetSchema,
    revalidate: '/budgets',
    operationName: 'Create budget',
  }
);

export const updateBudgetAction = withValidatedAction(
  async (input: typeof updateBudgetSchema._output) => {
    const { _id, ...updates } = input;
    const budget = await budgetRepository.update(_id, updates);

    if (!budget) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Budget not found');
    }

    return budget;
  },
  {
    schema: updateBudgetSchema,
    revalidate: '/budgets',
    operationName: 'Update budget',
  }
);

export const deleteBudgetAction = withAction(
  async (id: string) => {
    const budget = await budgetRepository.findById(id);

    if (!budget) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Budget not found');
    }

    await budgetRepository.delete(id);
  },
  {
    revalidate: '/budgets',
    operationName: 'Delete budget',
  }
);

export const getBudgetsAction = withAction(
  async (projectId: string) => {
    return await budgetRepository.findByProject(projectId);
  },
  {
    operationName: 'Get budgets',
  }
);
