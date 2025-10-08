'use client';

import { useState } from 'react';
import { useUpdateBudget, useDeleteBudget } from '@/hooks/use-budgets';
import { BudgetCategory } from './budget-category';
import { CategoryForm } from './category-form';
import type { IBudget, ICategory } from '@/models/budget';

interface BudgetItemProps {
  budget: IBudget;
}

export function BudgetItem({ budget }: BudgetItemProps) {
  const [isEditingVenue, setIsEditingVenue] = useState(false);
  const [venueName, setVenueName] = useState(budget.venueName);
  const [categories, setCategories] = useState<ICategory[]>(budget.categories);

  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const totalCents = categories.reduce((sum, category) => {
    return sum + category.providers.reduce((provSum, provider) => provSum + provider.amountCents, 0);
  }, 0);

  const handleUpdateVenue = async () => {
    if (!venueName.trim()) return;
    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      venueName,
    });
    setIsEditingVenue(false);
  };

  const handleAddCategory = async (category: ICategory) => {
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      categories: updatedCategories.map((cat) => ({
        ...(isValidObjectId(cat._id.toString()) ? { _id: cat._id.toString() } : {}),
        name: cat.name,
        providers: cat.providers.map((prov) => ({
          ...(isValidObjectId(prov._id.toString()) ? { _id: prov._id.toString() } : {}),
          name: prov.name,
          amountCents: prov.amountCents,
          notes: prov.notes,
          fields: prov.fields.map((field) => ({
            ...(isValidObjectId(field._id.toString()) ? { _id: field._id.toString() } : {}),
            key: field.key,
            value: field.value,
            fieldType: field.fieldType,
          })),
        })),
      })),
    });
  };

  const handleUpdateCategory = async (index: number, updated: ICategory) => {
    const updatedCategories = categories.map((cat, i) => (i === index ? updated : cat));
    setCategories(updatedCategories);

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      categories: updatedCategories.map((cat) => ({
        ...(isValidObjectId(cat._id.toString()) ? { _id: cat._id.toString() } : {}),
        name: cat.name,
        providers: cat.providers.map((prov) => ({
          ...(isValidObjectId(prov._id.toString()) ? { _id: prov._id.toString() } : {}),
          name: prov.name,
          amountCents: prov.amountCents,
          notes: prov.notes,
          fields: prov.fields.map((field) => ({
            ...(isValidObjectId(field._id.toString()) ? { _id: field._id.toString() } : {}),
            key: field.key,
            value: field.value,
            fieldType: field.fieldType,
          })),
        })),
      })),
    });
  };

  const handleDeleteCategory = async (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      categories: updatedCategories.map((cat) => ({
        ...(isValidObjectId(cat._id.toString()) ? { _id: cat._id.toString() } : {}),
        name: cat.name,
        providers: cat.providers.map((prov) => ({
          ...(isValidObjectId(prov._id.toString()) ? { _id: prov._id.toString() } : {}),
          name: prov.name,
          amountCents: prov.amountCents,
          notes: prov.notes,
          fields: prov.fields.map((field) => ({
            ...(isValidObjectId(field._id.toString()) ? { _id: field._id.toString() } : {}),
            key: field.key,
            value: field.value,
            fieldType: field.fieldType,
          })),
        })),
      })),
    });
  };

  const handleDeleteBudget = async () => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      await deleteBudget.mutateAsync(budget._id.toString());
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div className="flex-1 min-w-0">
          {isEditingVenue ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                onBlur={handleUpdateVenue}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateVenue()}
                autoFocus
              />
            </div>
          ) : (
            <div>
              <h3
                className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-primary transition"
                onClick={() => setIsEditingVenue(true)}
                title="Clique para editar"
              >
                {venueName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Total Geral: <span className="font-bold text-primary text-lg">{formatCurrency(totalCents)}</span>
                {categories.length > 0 && (
                  <span className="ml-2">• {categories.length} categoria(s)</span>
                )}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleDeleteBudget}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm shrink-0"
        >
          Remover Orçamento
        </button>
      </div>

      <div className="space-y-4">
        <CategoryForm onAdd={handleAddCategory} />

        {categories.length > 0 && (
          <div className="space-y-3">
            {categories.map((category, index) => (
              <BudgetCategory
                key={category._id.toString()}
                category={category}
                onUpdate={(updated) => handleUpdateCategory(index, updated)}
                onDelete={() => handleDeleteCategory(index)}
              />
            ))}
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Nenhuma categoria adicionada. Comece criando uma categoria acima.
          </div>
        )}
      </div>
    </div>
  );
}
