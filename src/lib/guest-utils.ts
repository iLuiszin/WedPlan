import type { IGuest } from '@/models/guest';
import type { SerializedDocument } from '@/types/mongoose-helpers';

export type SerializedGuest = SerializedDocument<IGuest>;

export interface GuestCouple {
  partnerA: SerializedGuest;
  partnerB: SerializedGuest;
}

export const getGuestFullName = (guest: SerializedGuest): string => {
  return `${guest.firstName} ${guest.lastName}`.trim();
};

export const matchesSearch = (guest: SerializedGuest, query: string): boolean => {
  if (!query) {
    return true;
  }

  const fullName = getGuestFullName(guest).toLowerCase();
  const searchQuery = query.toLowerCase();

  return fullName.includes(searchQuery);
};

export const findGuestCouples = (guests: SerializedGuest[]): GuestCouple[] => {
  const seenPairs = new Set<string>();
  const couples: GuestCouple[] = [];

  guests.forEach((guest) => {
    if (!guest.partnerId) {
      return;
    }

    const partner = guests.find((g) => g._id.toString() === guest.partnerId?.toString());
    if (!partner) {
      return;
    }

    const pairKey = [guest._id.toString(), partner._id.toString()].sort().join('-');
    if (seenPairs.has(pairKey)) {
      return;
    }

    seenPairs.add(pairKey);
    couples.push({ partnerA: guest, partnerB: partner });
  });

  return couples;
};

export const searchInCouples = (couples: GuestCouple[], query: string): GuestCouple[] => {
  if (!query) {
    return couples;
  }

  return couples.filter(({ partnerA, partnerB }) => {
    return matchesSearch(partnerA, query) || matchesSearch(partnerB, query);
  });
};
