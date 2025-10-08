'use client';

import { useState, useMemo } from 'react';
import { useBudgets } from '@/hooks/use-budgets';
import { useProjectContext } from '@/components/projects/project-context';
import { BudgetItem } from './budget-item';
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/constants';
import type { IBudget } from '@/models/budget';

type SortOption = 'recent' | 'cheapest' | 'expensive' | 'category';

export function BudgetList() {
  const { projectId } = useProjectContext();
  const { data: budgets, isLoading, error } = useBudgets(projectId);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
          const providerExpenses = provider.fields
            .filter(f => f.itemType === 'expense' && f.fieldType === 'currency')
            .reduce((fieldSum, field) => {
              const value = parseFloat(field.value) || 0;
              return fieldSum + Math.round(value * 100);
            }, 0);
          return providerSum + providerExpenses;
        }, 0)
      );
    }, 0);

    return itemsTotal + categoriesTotal;
  };

  const getBudgetMainCategory = (budget: IBudget): string => {
    return budget.categories.length > 0 ? budget.categories[0].name : 'Sem Categoria';
  };

  const filteredAndSortedBudgets = useMemo(() => {
    if (!budgets) return [];

    let result = [...budgets];

    if (categoryFilter !== 'all') {
      result = result.filter((budget) => {
        const mainCategory = getBudgetMainCategory(budget);
        return mainCategory === categoryFilter;
      });
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
        case 'category': {
          const catA = getBudgetMainCategory(a);
          const catB = getBudgetMainCategory(b);
          return catA.localeCompare(catB, 'pt-BR');
        }
        case 'recent':
        default: {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }
      }
    });

    return result;
  }, [budgets, sortBy, categoryFilter]);

  const grandTotal = useMemo(() => {
    if (!budgets) return 0;
    return budgets.reduce((sum, budget) => {
      return sum + getBudgetTotal(budget);
    }, 0);
  }, [budgets]);

  const availableCategories = useMemo(() => {
    if (!budgets) return [];
    const categories = new Set<string>();
    budgets.forEach((budget) => {
      const mainCat = getBudgetMainCategory(budget);
      if (mainCat !== 'Sem Categoria') {
        categories.add(mainCat);
      }
    });
    return Array.from(categories).sort((a, b) => a.localeCompare(b, 'pt-BR'));
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

      {filteredAndSortedBudgets.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
          Nenhum orçamento encontrado para a categoria selecionada.
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
