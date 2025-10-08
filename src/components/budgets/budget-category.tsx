'use client';

import { BudgetItemDetails } from './budget-item-details';
import { ItemForm } from './item-form';
import type { ICategory, IProvider } from '@/models/budget';

interface BudgetCategoryProps {
  category: ICategory;
  onUpdate: (updated: ICategory) => void;
}

export function BudgetCategory({ category, onUpdate }: BudgetCategoryProps) {
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
  );
}
