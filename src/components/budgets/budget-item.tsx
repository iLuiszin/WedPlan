'use client';

import { useState } from 'react';
import { useUpdateBudget, useDeleteBudget } from '@/hooks/use-budgets';
import { useModal } from '@/contexts/modal-context';
import { BudgetCategory } from './budget-category';
import type { IBudget, ICategory } from '@/models/budget';

const toDateOrNull = (value: Date | string | undefined): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

interface BudgetItemProps {
  budget: IBudget;
}

export function BudgetItem({ budget }: BudgetItemProps) {
  const initialCategory: ICategory | null = budget.categories[0] ?? null;
  const [category, setCategory] = useState<ICategory | null>(initialCategory);

  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const { showConfirm } = useModal();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const totalCents = category
    ? category.providers.reduce((sum, provider) => {
        const providerExpenses = provider.fields
          .filter(f => f.itemType === 'expense' && f.fieldType === 'currency')
          .reduce((fieldSum, field) => {
            const value = parseFloat(field.value) || 0;
            return fieldSum + Math.round(value * 100);
          }, 0);
        return sum + providerExpenses;
      }, 0)
    : 0;

  const mainCategory = category?.name || 'Orçamento';

  const handleUpdateCategory = async (updated: ICategory) => {
    setCategory(updated);

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      categories: [
        {
          ...(isValidObjectId(updated._id.toString()) ? { _id: updated._id.toString() } : {}),
          name: updated.name,
          providers: updated.providers.map((prov) => {
            const createdAt = toDateOrNull(prov.createdAt) ?? new Date();
            const updatedAt = toDateOrNull(prov.updatedAt) ?? createdAt;

            return {
              ...(isValidObjectId(prov._id.toString()) ? { _id: prov._id.toString() } : {}),
              name: prov.name,
              notes: prov.notes,
              amountCents: prov.amountCents ?? 0,
              createdAt,
              updatedAt,
              fields: prov.fields.map((field) => ({
                ...(isValidObjectId(field._id.toString()) ? { _id: field._id.toString() } : {}),
                key: field.key,
                value: field.value,
                fieldType: field.fieldType,
                itemType: field.itemType,
              })),
            };
          }),
        },
      ],
    });
  };

  const handleDeleteBudget = async () => {
    const confirmed = await showConfirm({
      message: 'Tem certeza que deseja excluir este orçamento?',
      variant: 'danger',
      confirmText: 'Excluir',
    });

    if (confirmed) {
      await deleteBudget.mutateAsync(budget._id.toString());
    }
  };

  if (!category) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="text-center py-8 text-gray-500">
          Orçamento sem categoria. Erro ao carregar.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{mainCategory}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Total: <span className="font-bold text-primary text-lg">{formatCurrency(totalCents)}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteBudget}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm shrink-0"
        >
          Remover Orçamento
        </button>
      </div>

      <BudgetCategory category={category} onUpdate={handleUpdateCategory} />
    </div>
  );
}
