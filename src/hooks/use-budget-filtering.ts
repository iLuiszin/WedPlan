import { useMemo, useState } from 'react';
import type { IBudget } from '@/models/budget';
import type { SerializedDocument } from '@/types/mongoose-helpers';
import { calculateBudgetTotal, getBudgetMainCategory } from '@/lib/budget-calculations';

type SortOption = 'recent' | 'cheapest' | 'expensive' | 'category';
type SerializedBudget = SerializedDocument<IBudget>;

const sortBudgets = (budgets: SerializedBudget[], sortBy: SortOption): SerializedBudget[] => {
  const sortFunctions: Record<SortOption, (a: SerializedBudget, b: SerializedBudget) => number> = {
    recent: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    cheapest: (a, b) => calculateBudgetTotal(a) - calculateBudgetTotal(b),
    expensive: (a, b) => calculateBudgetTotal(b) - calculateBudgetTotal(a),
    category: (a, b) => getBudgetMainCategory(a).localeCompare(getBudgetMainCategory(b), 'pt-BR'),
  };

  return [...budgets].sort(sortFunctions[sortBy]);
};

export const useBudgetFiltering = (budgets: SerializedBudget[] | undefined) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const filteredBudgets = useMemo(() => {
    if (!budgets) return [];

    let result = [...budgets];

    if (categoryFilter !== 'all') {
      result = result.filter((budget) => getBudgetMainCategory(budget) === categoryFilter);
    }

    return sortBudgets(result, sortBy);
  }, [budgets, sortBy, categoryFilter]);

  return {
    filteredBudgets,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    availableCategories,
  };
};
