'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createBudgetAction,
  updateBudgetAction,
  deleteBudgetAction,
  getBudgetsAction,
} from '../actions';
import type { CreateBudgetInput, UpdateBudgetInput } from '@/schemas/budget-schema';
import { queryKeys } from '@/lib/query-keys';

export function useBudgets(projectId: string, options = {}) {
  return useQuery({
    queryKey: queryKeys.budgets.byProject(projectId),
    queryFn: async () => {
      const result = await getBudgetsAction(projectId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBudgetInput) => {
      const result = await createBudgetAction(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      toast.success('Orçamento criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar orçamento: ${error.message}`);
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateBudgetInput) => {
      const result = await updateBudgetAction(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      toast.success('Orçamento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar orçamento: ${error.message}`);
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteBudgetAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all() });
      toast.success('Orçamento removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover orçamento: ${error.message}`);
    },
  });
}
