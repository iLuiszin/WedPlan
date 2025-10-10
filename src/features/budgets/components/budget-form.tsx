'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBudgetSchema, type CreateBudgetInput } from '@/schemas/budget-schema';
import { useCreateBudget } from '../hooks/use-budgets';
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/constants';
import { useState } from 'react';

interface BudgetFormProps {
  projectId: string;
}

export function BudgetForm({ projectId }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const createBudget = useCreateBudget();

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      projectId,
      items: [],
      categories: [],
    },
  });

  const onSubmit = async () => {
    if (!selectedCategory.trim()) return;

    setIsSubmitting(true);
    try {
      const data: CreateBudgetInput = {
        projectId,
        items: [],
        categories: [
          {
            name: selectedCategory,
            providers: [],
          },
        ],
      };

      await createBudget.mutateAsync(data);
      reset();
      setSelectedCategory('');
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
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria Principal *
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isSubmitting}
            required
          >
            <option value="">Selecione uma categoria...</option>
            {DEFAULT_BUDGET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.categories && (
            <p className="text-red-500 text-sm mt-1">{errors.categories.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !selectedCategory}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
      >
        {isSubmitting ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}
