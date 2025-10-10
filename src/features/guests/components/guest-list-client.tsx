'use client';

import { useState, useEffect } from 'react';
import { useGuests } from '../hooks/use-guests';
import { useGuestFiltering } from '../hooks/use-guest-filtering';
import { GuestItem } from './guest-item';
import { CoupleCard } from './couple-card';
import { GUEST_FILTERS, FILTER_LABELS, type GuestFilter } from '@/lib/constants';
import type { SerializedGuest } from '../types';

interface GuestListClientProps {
  projectId: string;
  initialData?: SerializedGuest[];
}

export function GuestListClient({ projectId, initialData }: GuestListClientProps) {
  const { data: guests, isLoading, error } = useGuests(projectId, { initialData });
  const [filterType, setFilterType] = useState<GuestFilter>(GUEST_FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredContent = useGuestFiltering(guests, filterType, debouncedSearchQuery);

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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as GuestFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(FILTER_LABELS).map(([filterValue, label]) => (
              <option key={filterValue} value={filterValue}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest/Couple List */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {filteredContent.items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum convidado encontrado</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
            {filteredContent.type === 'couples'
              ? filteredContent.items.map(({ partnerA, partnerB }) => (
                  <CoupleCard
                    key={`${partnerA._id.toString()}-${partnerB._id.toString()}`}
                    partnerA={partnerA}
                    partnerB={partnerB}
                  />
                ))
              : filteredContent.items.map((guest) => (
                  <GuestItem key={guest._id.toString()} guest={guest} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
