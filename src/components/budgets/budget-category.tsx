'use client';

import { useState } from 'react';
import { ProviderItem } from './provider-item';
import { ProviderForm } from './provider-form';
import type { ICategory, IProvider } from '@/models/budget';

interface BudgetCategoryProps {
  category: ICategory;
  onUpdate: (updated: ICategory) => void;
  onDelete: () => void;
}

export function BudgetCategory({ category, onUpdate, onDelete }: BudgetCategoryProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const categoryTotal = category.providers.reduce((sum, provider) => sum + provider.amountCents, 0);

  const handleNameSave = () => {
    if (!editedName.trim()) return;
    onUpdate({ ...category, name: editedName.trim() });
    setIsEditingName(false);
  };

  const handleAddProvider = (provider: IProvider) => {
    onUpdate({ ...category, providers: [...category.providers, provider] });
  };

  const handleUpdateProvider = (index: number, updated: IProvider) => {
    const providers = category.providers.map((p, i) => (i === index ? updated : p));
    onUpdate({ ...category, providers });
  };

  const handleDeleteProvider = (index: number) => {
    const providers = category.providers.filter((_, i) => i !== index);
    onUpdate({ ...category, providers });
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja remover a categoria "${category.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div className="bg-white border-2 border-primary/20 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded"
                onBlur={handleNameSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') {
                    setEditedName(category.name);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <div>
              <h3
                className="text-lg font-bold text-gray-800 cursor-pointer hover:text-primary"
                onClick={() => setIsEditingName(true)}
                title="Clique para editar"
              >
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Total: <span className="font-semibold text-primary">{formatCurrency(categoryTotal)}</span>
                {category.providers.length > 0 && (
                  <span className="ml-2">• {category.providers.length} item(ns)</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {isExpanded ? '▲ Recolher' : '▼ Expandir'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remover
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <ProviderForm onAdd={handleAddProvider} />

          {category.providers.length > 0 && (
            <div className="space-y-2">
              {category.providers.map((provider, index) => (
                <ProviderItem
                  key={provider._id.toString()}
                  provider={provider}
                  onUpdate={(updated) => handleUpdateProvider(index, updated)}
                  onDelete={() => handleDeleteProvider(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
