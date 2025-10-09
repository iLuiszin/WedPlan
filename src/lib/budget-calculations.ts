import type { IBudget, IBudgetItem, ICategory, IProvider, ICategoryField } from '@/models/budget';
import type { SerializedDocument } from '@/types/mongoose-helpers';

type BudgetLike = IBudget | SerializedDocument<IBudget>;

export const calculateBudgetTotal = (budget: BudgetLike): number => {
  const itemsTotal = calculateItemsTotal(budget.items);
  const categoriesTotal = calculateCategoriesTotal(budget.categories);
  return itemsTotal + categoriesTotal;
};

const calculateItemsTotal = (items: IBudgetItem[] = []): number => {
  return items.reduce((sum, item) => sum + item.amountCents, 0);
};

const calculateCategoriesTotal = (categories: ICategory[] = []): number => {
  return categories.reduce((sum, category) => {
    return sum + calculateProvidersTotal(category.providers);
  }, 0);
};

const calculateProvidersTotal = (providers: IProvider[] = []): number => {
  return providers.reduce((sum, provider) => {
    return sum + calculateProviderExpenses(provider.fields);
  }, 0);
};

const calculateProviderExpenses = (fields: ICategoryField[] = []): number => {
  return fields
    .filter(f => f.itemType === 'expense' && f.fieldType === 'currency')
    .reduce((sum, field) => {
      const value = parseFloat(field.value) || 0;
      return sum + Math.round(value * 100);
    }, 0);
};

export const getBudgetMainCategory = (budget: BudgetLike): string => {
  return budget.categories?.[0]?.name ?? 'Sem Categoria';
};
