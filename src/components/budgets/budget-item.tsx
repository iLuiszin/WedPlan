'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import { useUpdateBudget, useDeleteBudget } from '@/hooks/use-budgets';
import type { IBudget, IBudgetItem } from '@/models/budget';

interface BudgetItemProps {
  budget: IBudget;
}

export function BudgetItem({ budget }: BudgetItemProps) {
  const [isEditingVenue, setIsEditingVenue] = useState(false);
  const [venueName, setVenueName] = useState(budget.venueName);
  const [items, setItems] = useState<IBudgetItem[]>(budget.items);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const handleUpdateVenue = async () => {
    if (!venueName.trim()) return;
    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      venueName,
    });
    setIsEditingVenue(false);
  };

  const handleAddItem = async () => {
    if (!newItemTitle.trim() || !newItemAmount) return;

    const newItem: IBudgetItem = {
      _id: new Types.ObjectId(new Date().getTime().toString(16).padStart(24, '0')),
      title: newItemTitle,
      amountCents: Math.round(parseFloat(newItemAmount) * 100),
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      items: updatedItems.map((item) => {
        const baseItem = {
          title: item.title,
          amountCents: item.amountCents,
        };
        const itemIdStr = item._id.toString();
        if (isValidObjectId(itemIdStr)) {
          return { ...baseItem, _id: itemIdStr };
        }
        return baseItem;
      }),
    });

    setNewItemTitle('');
    setNewItemAmount('');
  };

  const handleDeleteItem = async (itemId: string) => {
    const itemToDelete = items.find((item) => item._id.toString() === itemId);
    if (!itemToDelete) return;

    if (!confirm(`Tem certeza que deseja remover "${itemToDelete.title}"?`)) {
      return;
    }

    const updatedItems = items.filter((item) => item._id.toString() !== itemId);
    setItems(updatedItems);

    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    await updateBudget.mutateAsync({
      _id: budget._id.toString(),
      items: updatedItems.map((item) => {
        const baseItem = {
          title: item.title,
          amountCents: item.amountCents,
        };
        const itemIdStr = item._id.toString();
        if (isValidObjectId(itemIdStr)) {
          return { ...baseItem, _id: itemIdStr };
        }
        return baseItem;
      }),
    });
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      await deleteBudget.mutateAsync(budget._id.toString());
    }
  };

  const totalCents = items.reduce((sum, item) => sum + item.amountCents, 0);
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditingVenue ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded"
                onBlur={handleUpdateVenue}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateVenue()}
                autoFocus
              />
            </div>
          ) : (
            <h3
              className="text-xl font-semibold cursor-pointer hover:text-primary"
              onClick={() => setIsEditingVenue(true)}
              title="Clique para editar"
            >
              {venueName}
            </h3>
          )}
          <p className="text-sm text-gray-500">
            Total: <span className="font-semibold text-primary">{formatCurrency(totalCents)}</span>
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remover Orçamento
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item._id.toString()} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="flex-1">{item.title}</span>
            <span className="font-semibold mr-4">{formatCurrency(item.amountCents)}</span>
            <button
              onClick={() => handleDeleteItem(item._id.toString())}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold mb-2">Adicionar Item</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Descrição"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
            step="0.01"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
