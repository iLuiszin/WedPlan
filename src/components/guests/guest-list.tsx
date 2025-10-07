'use client';

import { useGuests } from '@/hooks/use-guests';
import { useProjectContext } from '@/components/projects/project-context';
import { GuestItem } from './guest-item';
import { useState } from 'react';
import type { GuestCategory } from '@/schemas/guest-schema';

export function GuestList() {
  const { projectId } = useProjectContext();
  const { data: guests, isLoading, error } = useGuests(projectId);
  const [filterCategory, setFilterCategory] = useState<GuestCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-red-500">Erro ao carregar convidados: {error.message}</p>
      </div>
    );
  }

  const filteredGuests = guests?.filter((guest) => {
    const matchesCategory = filterCategory === 'all' || guest.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as GuestCategory | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="groom">Noivo</option>
            <option value="bride">Noiva</option>
            <option value="both">Ambos</option>
          </select>
        </div>
      </div>

      {/* Guest List */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {!filteredGuests || filteredGuests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum convidado encontrado</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
            {filteredGuests.map((guest) => (
              <GuestItem key={guest._id.toString()} guest={guest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
