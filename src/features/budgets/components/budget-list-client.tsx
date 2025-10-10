'use client';

import { useBudgets } from '../hooks/use-budgets';
import { useBudgetFiltering } from '../hooks/use-budget-filtering';
import { BudgetItem } from './budget-item';
import type { IBudget } from '@/models/budget';
import type { SerializedDocument } from '@/types/mongoose-helpers';

type SortOption = 'recent' | 'cheapest' | 'expensive' | 'category';
type SerializedBudget = SerializedDocument<IBudget>;

interface BudgetListClientProps {
  projectId: string;
  initialData?: SerializedBudget[];
}

export function BudgetListClient({ projectId, initialData }: BudgetListClientProps) {
  const { data: budgets, isLoading, error } = useBudgets(projectId, { initialData });

  const {
    filteredBudgets,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    availableCategories,
  } = useBudgetFiltering(budgets);

  if (isLoading) {
    return <div className="text-center py-8">Carregando orçamentos...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar orçamentos. Tente novamente.
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
        Nenhum orçamento encontrado. Adicione um acima.
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas as Categorias</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Mais Recentes</option>
              <option value="cheapest">Mais Baratos</option>
              <option value="expensive">Mais Caros</option>
              <option value="category">Categoria (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
          Nenhum orçamento encontrado para a categoria selecionada.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBudgets.map((budget) => (
            <BudgetItem key={budget._id.toString()} budget={budget} />
          ))}
        </div>
      )}
    </div>
  );
}
