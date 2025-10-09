import { describe, expect, it } from 'vitest';
import {
  findGuestCouples,
  getGuestFullName,
  matchesSearch,
  searchInCouples,
  type SerializedGuest,
} from '../guest-utils';

const createGuest = (
  overrides: Partial<SerializedGuest> = {}
): SerializedGuest => ({
  _id: '1',
  projectId: 'project-1',
  firstName: 'John',
  lastName: 'Doe',
  category: 'both',
  role: 'guest',
  partnerId: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

describe('getGuestFullName', () => {
  it('returns full name with first and last name', () => {
    const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
    expect(getGuestFullName(guest)).toBe('John Doe');
  });

  it('returns first name when last name is empty', () => {
    const guest = createGuest({ firstName: 'John', lastName: '' });
    expect(getGuestFullName(guest)).toBe('John');
  });

  it('handles names with extra spaces', () => {
    const guest = createGuest({ firstName: ' John ', lastName: ' Doe ' });
    expect(getGuestFullName(guest)).toBe('John   Doe');
  });

  it('returns trimmed result for first name only', () => {
    const guest = createGuest({ firstName: 'Maria', lastName: '' });
    expect(getGuestFullName(guest)).toBe('Maria');
  });
});

describe('matchesSearch', () => {
  describe('matches names correctly', () => {
    it('returns true when query is empty', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, '')).toBe(true);
    });

    it('matches exact full name', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, 'John Doe')).toBe(true);
    });

    it('matches partial first name', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, 'Joh')).toBe(true);
    });

    it('matches partial last name', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, 'Do')).toBe(true);
    });

    it('matches anywhere in the full name', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, 'hn D')).toBe(true);
    });

    it('is case insensitive', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, 'JOHN DOE')).toBe(true);
      expect(matchesSearch(guest, 'john doe')).toBe(true);
      expect(matchesSearch(guest, 'JoHn DoE')).toBe(true);
    });

    it('returns false when query does not match', () => {
      const guest = createGuest({ firstName: 'John', lastName: 'Doe' });
      expect(matchesSearch(guest, 'Maria')).toBe(false);
    });

    it('matches first name when last name is empty', () => {
      const guest = createGuest({ firstName: 'Maria', lastName: '' });
      expect(matchesSearch(guest, 'Mar')).toBe(true);
    });
  });
});

describe('findGuestCouples', () => {
  describe('finds linked partner pairs', () => {
    it('returns empty array when no guests', () => {
      expect(findGuestCouples([])).toEqual([]);
    });

    it('returns empty array when no guests have partners', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John' }),
        createGuest({ _id: '2', firstName: 'Maria' }),
      ];

      expect(findGuestCouples(guests)).toEqual([]);
    });

    it('finds single couple', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John', partnerId: '2' }),
        createGuest({ _id: '2', firstName: 'Maria', partnerId: '1' }),
      ];

      const couples = findGuestCouples(guests);

      expect(couples).toHaveLength(1);
      expect(couples[0].partnerA.firstName).toBe('John');
      expect(couples[0].partnerB.firstName).toBe('Maria');
    });

    it('finds multiple couples', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John', partnerId: '2' }),
        createGuest({ _id: '2', firstName: 'Maria', partnerId: '1' }),
        createGuest({ _id: '3', firstName: 'Bob', partnerId: '4' }),
        createGuest({ _id: '4', firstName: 'Alice', partnerId: '3' }),
      ];

      const couples = findGuestCouples(guests);

      expect(couples).toHaveLength(2);
    });

    it('ignores guests with partners not in the list', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John', partnerId: '999' }),
        createGuest({ _id: '2', firstName: 'Maria', partnerId: null }),
      ];

      expect(findGuestCouples(guests)).toEqual([]);
    });

    it('avoids duplicate couples', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John', partnerId: '2' }),
        createGuest({ _id: '2', firstName: 'Maria', partnerId: '1' }),
      ];

      const couples = findGuestCouples(guests);

      expect(couples).toHaveLength(1);
    });

    it('handles guests with null partnerId', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John', partnerId: null }),
        createGuest({ _id: '2', firstName: 'Maria', partnerId: '3' }),
        createGuest({ _id: '3', firstName: 'Bob', partnerId: '2' }),
      ];

      const couples = findGuestCouples(guests);

      expect(couples).toHaveLength(1);
      expect(couples[0].partnerA.firstName).toBe('Maria');
      expect(couples[0].partnerB.firstName).toBe('Bob');
    });

    it('handles mixed linked and unlinked guests', () => {
      const guests: SerializedGuest[] = [
        createGuest({ _id: '1', firstName: 'John', partnerId: '2' }),
        createGuest({ _id: '2', firstName: 'Maria', partnerId: '1' }),
        createGuest({ _id: '3', firstName: 'Single', partnerId: null }),
        createGuest({ _id: '4', firstName: 'Bob', partnerId: '5' }),
        createGuest({ _id: '5', firstName: 'Alice', partnerId: '4' }),
      ];

      const couples = findGuestCouples(guests);

      expect(couples).toHaveLength(2);
    });
  });
});

describe('searchInCouples', () => {
  const couples = [
    {
      partnerA: createGuest({ _id: '1', firstName: 'John', lastName: 'Smith' }),
      partnerB: createGuest({ _id: '2', firstName: 'Maria', lastName: 'Garcia' }),
    },
    {
      partnerA: createGuest({ _id: '3', firstName: 'Bob', lastName: 'Taylor' }),
      partnerB: createGuest({ _id: '4', firstName: 'Alice', lastName: 'Williams' }),
    },
  ];

  describe('filters couples by search query', () => {
    it('returns all couples when query is empty', () => {
      expect(searchInCouples(couples, '')).toHaveLength(2);
    });

    it('finds couple by partnerA name', () => {
      const result = searchInCouples(couples, 'John');
      expect(result).toHaveLength(1);
      expect(result[0].partnerA.firstName).toBe('John');
    });

    it('finds couple by partnerB name', () => {
      const result = searchInCouples(couples, 'Maria');
      expect(result).toHaveLength(1);
      expect(result[0].partnerB.firstName).toBe('Maria');
    });

    it('finds couple by partial name match', () => {
      const result = searchInCouples(couples, 'Garc');
      expect(result).toHaveLength(1);
      expect(result[0].partnerB.lastName).toBe('Garcia');
    });

    it('returns multiple couples when query matches multiple', () => {
      const result = searchInCouples(couples, 'i');
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('is case insensitive', () => {
      const result = searchInCouples(couples, 'JOHN');
      expect(result).toHaveLength(1);
      expect(result[0].partnerA.firstName).toBe('John');
    });

    it('returns empty array when no matches found', () => {
      const result = searchInCouples(couples, 'Nonexistent');
      expect(result).toEqual([]);
    });

    it('matches either partner in a couple', () => {
      const result = searchInCouples(couples, 'Williams');
      expect(result).toHaveLength(1);
      expect(result[0].partnerB.lastName).toBe('Williams');
    });
  });
});
