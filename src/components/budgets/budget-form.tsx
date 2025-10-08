'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBudgetSchema, type CreateBudgetInput } from '@/schemas/budget-schema';
import { useCreateBudget } from '@/hooks/use-budgets';
import { useProjectContext } from '@/components/projects/project-context';
import { useState } from 'react';

export function BudgetForm() {
  const { projectId } = useProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBudget = useCreateBudget();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      projectId,
      venueName: '',
      items: [],
    },
  });

  const onSubmit = async (data: CreateBudgetInput) => {
    setIsSubmitting(true);
    try {
      await createBudget.mutateAsync(data);
      reset();
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg p-6 shadow-sm mb-6 flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-4">Adicionar Orçamento</h3>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Local *
          </label>
          <input
            {...register('venueName')}
            id="venueName"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Buffet São Paulo"
            disabled={isSubmitting}
          />
          {errors.venueName && (
            <p className="text-red-500 text-sm mt-1">{errors.venueName.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
      >
        {isSubmitting ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}
