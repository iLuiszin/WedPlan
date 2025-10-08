'use client';

import { useState } from 'react';
import { BudgetItemDetails } from './budget-item-details';
import { ItemForm } from './item-form';
import type { ICategory, IProvider } from '@/models/budget';

interface BudgetCategoryProps {
  category: ICategory;
  onUpdate: (updated: ICategory) => void;
}

export function BudgetCategory({ category, onUpdate }: BudgetCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const categoryTotal = category.providers.reduce((sum, item) => sum + item.amountCents, 0);

  const handleAddItem = (item: IProvider) => {
    onUpdate({ ...category, providers: [...category.providers, item] });
  };

  const handleUpdateItem = (index: number, updated: IProvider) => {
    const providers = category.providers.map((p, i) => (i === index ? updated : p));
    onUpdate({ ...category, providers });
  };

  const handleDeleteItem = (index: number) => {
    const providers = category.providers.filter((_, i) => i !== index);
    onUpdate({ ...category, providers });
  };

  return (
    <div className="bg-white border-2 border-primary/20 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Total: <span className="font-semibold text-primary">{formatCurrency(categoryTotal)}</span>
              {category.providers.length > 0 && (
                <span className="ml-2">• {category.providers.length} item(ns)</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {isExpanded ? '▲ Recolher' : '▼ Expandir'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <ItemForm onAdd={handleAddItem} />

          {category.providers.length > 0 && (
            <div className="space-y-2">
              {category.providers.map((item, index) => (
                <BudgetItemDetails
                  key={item._id.toString()}
                  provider={item}
                  onUpdate={(updated) => handleUpdateItem(index, updated)}
                  onDelete={() => handleDeleteItem(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
