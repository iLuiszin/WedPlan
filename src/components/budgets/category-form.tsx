'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/constants';
import type { ICategory } from '@/models/budget';

interface CategoryFormProps {
  onAdd: (category: ICategory) => void;
}

export function CategoryForm({ onAdd }: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCategoryName(suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">Adicionar Nova Categoria</h4>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Nome da categoria (ex: Buffet, Local, Fotografia)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {showSuggestions && categoryName.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1 px-2">Sugestões:</p>
                  {DEFAULT_BUDGET_CATEGORIES.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 rounded"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm whitespace-nowrap"
          >
            + Categoria
          </button>
        </div>
        {showSuggestions && categoryName.length === 0 && (
          <button
            type="button"
            onClick={() => setShowSuggestions(false)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Ocultar sugestões
          </button>
        )}
      </div>
    </form>
  );
}
