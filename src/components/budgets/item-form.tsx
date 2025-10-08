'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import type { IProvider } from '@/models/budget';

interface ItemFormProps {
  onAdd: (item: IProvider) => void;
}

export function ItemForm({ onAdd }: ItemFormProps) {
  const [itemName, setItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) return;

    const newItem: IProvider = {
      _id: new Types.ObjectId(new Date().getTime().toString(16).padStart(24, '0')),
      name: itemName.trim(),
      fields: [],
      notes: '',
    };

    onAdd(newItem);
    setItemName('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">Adicionar Item/Subcategoria</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nome do item (ex: Buffet Vistosa, Local X)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm whitespace-nowrap"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
