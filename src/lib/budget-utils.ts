import type { ICategoryField, IProvider } from '@/models/budget';

export enum ProviderSortOption {
  oldest = 'oldest',
  recent = 'recent',
  cheapest = 'cheapest',
  expensive = 'expensive',
  name = 'name',
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const isExpenseCurrencyField = (field: ICategoryField): boolean => {
  if (field.itemType !== 'expense') {
    return false;
  }

  return field.fieldType === 'currency';
};

const toDateInstance = (value: Date | string | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getCreatedAtTimestamp = (provider: IProvider): number | null => {
  const dateInstance = toDateInstance(provider.createdAt);
  return dateInstance ? dateInstance.getTime() : null;
};

const providerSortComparators: Record<ProviderSortOption, (a: IProvider, b: IProvider) => number> = {
  [ProviderSortOption.oldest]: (a, b) => {
    const aTimestamp = getCreatedAtTimestamp(a);
    const bTimestamp = getCreatedAtTimestamp(b);

    if (aTimestamp === null && bTimestamp === null) {
      return 0;
    }

    if (aTimestamp === null) {
      return -1;
    }

    if (bTimestamp === null) {
      return 1;
    }

    return aTimestamp - bTimestamp;
  },
  [ProviderSortOption.recent]: (a, b) => {
    const aTimestamp = getCreatedAtTimestamp(a);
    const bTimestamp = getCreatedAtTimestamp(b);

    if (aTimestamp === null && bTimestamp === null) {
      return 0;
    }

    if (aTimestamp === null) {
      return 1;
    }

    if (bTimestamp === null) {
      return -1;
    }

    return bTimestamp - aTimestamp;
  },
  [ProviderSortOption.cheapest]: (a, b) => {
    return getProviderTotalCents(a) - getProviderTotalCents(b);
  },
  [ProviderSortOption.expensive]: (a, b) => {
    return getProviderTotalCents(b) - getProviderTotalCents(a);
  },
  [ProviderSortOption.name]: (a, b) => {
    return a.name.localeCompare(b.name, 'pt-BR');
  },
};

export const formatCurrencyFromCents = (cents: number): string => {
  return currencyFormatter.format(cents / 100);
};

export const getProviderTotalCents = (provider: IProvider): number => {
  return provider.fields
    .filter(isExpenseCurrencyField)
    .reduce((sum, field) => {
      const value = Number.parseFloat(field.value) || 0;
      return sum + Math.round(value * 100);
    }, 0);
};

export const sortProviders = (
  providers: IProvider[],
  sortOption: ProviderSortOption
): IProvider[] => {
  const comparator = providerSortComparators[sortOption] ?? providerSortComparators[ProviderSortOption.oldest];
  return [...providers].sort(comparator);
};
