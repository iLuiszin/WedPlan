'use server';

import { createBudgetSchema, updateBudgetSchema } from '@/schemas/budget-schema';
import { AppError, ErrorCode } from '@/types/error-codes';
import { withAction, withValidatedAction } from '@/lib/action-wrapper';
import { createBudget } from './api/create-budget';
import { updateBudget } from './api/update-budget';
import { deleteBudget } from './api/delete-budget';
import { findBudgetById } from './api/get-budget';
import { findBudgetsByProject } from './api/get-budgets';

export const createBudgetAction = withValidatedAction(
  async (input: typeof createBudgetSchema._output) => {
    return await createBudget(input);
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
    const budget = await updateBudget(_id, updates);

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
    const budget = await findBudgetById(id);

    if (!budget) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Budget not found');
    }

    await deleteBudget(id);
  },
  {
    revalidate: '/budgets',
    operationName: 'Delete budget',
  }
);

export const getBudgetsAction = withAction(
  async (projectId: string) => {
    return await findBudgetsByProject(projectId);
  },
  {
    operationName: 'Get budgets',
  }
);
