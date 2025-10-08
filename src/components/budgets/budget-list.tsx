'use client';

import { useState, useMemo } from 'react';
import { useBudgets } from '@/hooks/use-budgets';
import { useProjectContext } from '@/components/projects/project-context';
import { BudgetItem } from './budget-item';
import type { IBudget } from '@/models/budget';

type SortOption = 'recent' | 'cheapest' | 'expensive' | 'name';

export function BudgetList() {
  const { projectId } = useProjectContext();
  const { data: budgets, isLoading, error } = useBudgets(projectId);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const getBudgetTotal = (budget: IBudget): number => {
    const itemsTotal = (budget.items ?? []).reduce((sum, item) => sum + item.amountCents, 0);

    const categoriesTotal = (budget.categories ?? []).reduce((sectionSum, category) => {
      return (
        sectionSum +
        (category.providers ?? []).reduce((providerSum, provider) => {
          return providerSum + provider.amountCents;
        }, 0)
      );
    }, 0);

    return itemsTotal + categoriesTotal;
  };

  const filteredAndSortedBudgets = useMemo(() => {
    if (!budgets) return [];

    let result = [...budgets];

    if (searchQuery.trim()) {
      result = result.filter((budget) =>
        budget.venueName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'cheapest': {
          const totalA = getBudgetTotal(a);
          const totalB = getBudgetTotal(b);
          return totalA - totalB;
        }
        case 'expensive': {
          const totalA = getBudgetTotal(a);
          const totalB = getBudgetTotal(b);
          return totalB - totalA;
        }
        case 'name':
          return a.venueName.localeCompare(b.venueName, 'pt-BR');
        case 'recent':
        default: {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }
      }
    });

    return result;
  }, [budgets, sortBy, searchQuery]);

  const grandTotal = useMemo(() => {
    if (!budgets) return 0;
    return budgets.reduce((sum, budget) => {
      return sum + getBudgetTotal(budget);
    }, 0);
  }, [budgets]);

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
      <div className="bg-primary text-white rounded-lg p-6 mb-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Total Geral</h3>
        <p className="text-3xl font-bold">{formatCurrency(grandTotal)}</p>
        <p className="text-sm opacity-90 mt-1">{budgets.length} orçamento(s) registrado(s)</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar por local..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedBudgets.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
          Nenhum orçamento encontrado para &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedBudgets.map((budget) => (
            <BudgetItem key={budget._id.toString()} budget={budget} />
          ))}
        </div>
      )}
    </div>
  );
}
