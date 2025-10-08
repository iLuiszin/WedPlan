'use client';

import { useMemo, useState } from 'react';
import { BudgetItemDetails } from './budget-item-details';
import { ItemForm } from './item-form';
import type { ICategory, IProvider } from '@/models/budget';
import { ProviderSortOption, sortProviders } from '@/lib/budget-utils';

interface BudgetCategoryProps {
  category: ICategory;
  onUpdate: (updated: ICategory) => void;
}

const providerSortOptions: ReadonlyArray<{ value: ProviderSortOption; label: string }> = [
  { value: ProviderSortOption.oldest, label: 'Mais antigos' },
  { value: ProviderSortOption.recent, label: 'Mais recentes' },
  { value: ProviderSortOption.cheapest, label: 'Mais baratos' },
  { value: ProviderSortOption.expensive, label: 'Mais caros' },
  { value: ProviderSortOption.name, label: 'Nome (A-Z)' },
];

const getProviderId = (provider: IProvider): string => provider._id.toString();
const getSortOptionFromValue = (value: string): ProviderSortOption => {
  const option = providerSortOptions.find((item) => item.value === value);
  return option ? option.value : ProviderSortOption.oldest;
};

export function BudgetCategory({ category, onUpdate }: BudgetCategoryProps) {
  const [sortBy, setSortBy] = useState<ProviderSortOption>(ProviderSortOption.oldest);

  const sortedProviders = useMemo(
    () => sortProviders(category.providers, sortBy),
    [category.providers, sortBy]
  );

  const handleAddItem = (item: IProvider) => {
    onUpdate({ ...category, providers: [...category.providers, item] });
  };

  const handleUpdateItem = (providerId: string, updated: IProvider) => {
    const providers = category.providers.map((current) => {
      return getProviderId(current) === providerId ? updated : current;
    });
    onUpdate({ ...category, providers });
  };

  const handleDeleteItem = (providerId: string) => {
    const providers = category.providers.filter((provider) => {
      return getProviderId(provider) !== providerId;
    });
    onUpdate({ ...category, providers });
  };

  return (
    <div className="space-y-3">
      <ItemForm onAdd={handleAddItem} />

      {category.providers.length > 1 && (
        <div className="flex justify-end">
          <label className="sr-only" htmlFor="provider-sort">
            Ordenar fornecedores
          </label>
          <select
            id="provider-sort"
            value={sortBy}
            onChange={(event) => setSortBy(getSortOptionFromValue(event.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {providerSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {sortedProviders.length > 0 && (
        <div className="space-y-2">
          {sortedProviders.map((item) => {
            const providerId = getProviderId(item);
            return (
              <BudgetItemDetails
                key={providerId}
                provider={item}
                onUpdate={(updated) => handleUpdateItem(providerId, updated)}
                onDelete={() => handleDeleteItem(providerId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
