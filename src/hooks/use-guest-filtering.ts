import { useMemo } from 'react';
import type { GuestFilter } from '@/lib/constants';
import { GUEST_FILTERS, GUEST_ROLES } from '@/lib/constants';
import {
  findGuestCouples,
  matchesSearch,
  searchInCouples,
  type SerializedGuest,
  type GuestCouple,
} from '@/lib/guest-utils';

type FilteredContent =
  | { type: 'guests'; items: SerializedGuest[] }
  | { type: 'couples'; items: GuestCouple[] };

export const useGuestFiltering = (
  guests: SerializedGuest[] | undefined,
  filterType: GuestFilter,
  searchQuery: string
): FilteredContent => {
  return useMemo(() => {
    if (!guests) {
      return { type: 'guests', items: [] };
    }

    // Handle couples filter
    if (filterType === GUEST_FILTERS.COUPLES) {
      const couples = findGuestCouples(guests);
      const filtered = searchInCouples(couples, searchQuery);
      return { type: 'couples', items: filtered };
    }

    // Handle other filters
    const filtered = guests.filter((guest) => {
      // Filter by role
      if (filterType === GUEST_FILTERS.GROOMSMEN && guest.role !== GUEST_ROLES.GROOMSMAN) {
        return false;
      }
      if (filterType === GUEST_FILTERS.BRIDESMAIDS && guest.role !== GUEST_ROLES.BRIDESMAID) {
        return false;
      }

      // Filter by category (for non-ALL, non-role filters)
      if (
        filterType !== GUEST_FILTERS.ALL &&
        filterType !== GUEST_FILTERS.GROOMSMEN &&
        filterType !== GUEST_FILTERS.BRIDESMAIDS &&
        guest.category !== filterType
      ) {
        return false;
      }

      // Filter by search query
      if (!matchesSearch(guest, searchQuery)) {
        return false;
      }

      return true;
    });

    return { type: 'guests', items: filtered };
  }, [guests, filterType, searchQuery]);
};
