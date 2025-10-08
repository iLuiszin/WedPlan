'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/constants';
import type { ICategory } from '@/models/budget';

interface CategoryFormProps {
  onAdd: (category: ICategory) => void;
  existingCategories: string[];
}

export function CategoryForm({ onAdd, existingCategories }: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    const newCategory: ICategory = {
      _id: new Types.ObjectId(new Date().getTime().toString(16).padStart(24, '0')),
      name: categoryName.trim(),
      providers: [],
    };

    onAdd(newCategory);
    setCategoryName('');
  };

  const availableCategories = DEFAULT_BUDGET_CATEGORIES.filter(
    (category) => !existingCategories.includes(category)
  );

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">Adicionar Nova Categoria</h4>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Selecione uma categoria...</option>
          {availableCategories.length > 0 ? (
            availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Todas as categorias já foram adicionadas
            </option>
          )}
        </select>
        <button
          type="submit"
          disabled={!categoryName || availableCategories.length === 0}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Categoria
        </button>
      </div>
    </form>
  );
}
