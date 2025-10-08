'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import type { IProvider } from '@/models/budget';

interface ProviderFormProps {
  onAdd: (provider: IProvider) => void;
}

export function ProviderForm({ onAdd }: ProviderFormProps) {
  const [providerName, setProviderName] = useState('');
  const [providerAmount, setProviderAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!providerName.trim()) return;

    const newProvider: IProvider = {
      _id: new Types.ObjectId(new Date().getTime().toString(16).padStart(24, '0')),
      name: providerName.trim(),
      fields: [],
      notes: '',
      amountCents: Math.round(parseFloat(providerAmount || '0') * 100),
    };

    onAdd(newProvider);
    setProviderName('');
    setProviderAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">Adicionar Prestador/Item</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nome do prestador/item"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={providerAmount}
          onChange={(e) => setProviderAmount(e.target.value)}
          className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          step="0.01"
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
