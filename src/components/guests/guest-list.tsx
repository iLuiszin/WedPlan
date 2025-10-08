'use client';

import { useGuests } from '@/hooks/use-guests';
import { useProjectContext } from '@/components/projects/project-context';
import { GuestItem } from './guest-item';
import { CoupleCard } from './couple-card';
import { useState, useMemo } from 'react';
import { GUEST_FILTERS, GUEST_ROLES, FILTER_LABELS, type GuestFilter } from '@/lib/constants';

export function GuestList() {
  const { projectId } = useProjectContext();
  const { data: guests, isLoading, error } = useGuests(projectId);
  const [filterType, setFilterType] = useState<GuestFilter>(GUEST_FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = useMemo(() => {
    if (!guests) return { type: 'guests' as const, items: [] };

    const query = searchQuery.toLowerCase();

    if (filterType === GUEST_FILTERS.COUPLES) {
      const seenPairs = new Set<string>();
      const couples: Array<{ partnerA: typeof guests[0]; partnerB: typeof guests[0] }> = [];

      guests.forEach((guest) => {
        if (!guest.partnerId) return;

        const partner = guests.find((g) => g._id.toString() === guest.partnerId?.toString());
        if (!partner) return;

        const pairKey = [guest._id.toString(), partner._id.toString()].sort().join('-');
        if (seenPairs.has(pairKey)) return;

        if (
          query &&
          !`${guest.firstName} ${guest.lastName}`.toLowerCase().includes(query) &&
          !`${partner.firstName} ${partner.lastName}`.toLowerCase().includes(query)
        ) {
          return;
        }

        seenPairs.add(pairKey);
        couples.push({ partnerA: guest, partnerB: partner });
      });

      return { type: 'couples' as const, items: couples };
    }

    const filtered = guests.filter((guest) => {
      if (filterType === GUEST_FILTERS.GROOMSMEN && guest.role !== GUEST_ROLES.GROOMSMAN) {
        return false;
      }
      if (filterType === GUEST_FILTERS.BRIDESMAIDS && guest.role !== GUEST_ROLES.BRIDESMAID) {
        return false;
      }
      if (
        filterType !== GUEST_FILTERS.ALL &&
        filterType !== GUEST_FILTERS.GROOMSMEN &&
        filterType !== GUEST_FILTERS.BRIDESMAIDS &&
        guest.category !== filterType
      ) {
        return false;
      }

      if (query && !`${guest.firstName} ${guest.lastName}`.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });

    return { type: 'guests' as const, items: filtered };
  }, [guests, filterType, searchQuery]);

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
