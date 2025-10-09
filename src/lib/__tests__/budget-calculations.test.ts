import { describe, expect, it } from 'vitest';
import { calculateBudgetTotal, getBudgetMainCategory } from '../budget-calculations';
import type { IBudget, ICategory } from '@/models/budget';
import type { SerializedDocument } from '@/types/mongoose-helpers';

type SerializedBudget = SerializedDocument<IBudget>;

const createEmptyBudget = (): SerializedBudget => ({
  _id: '1',
  projectId: 'project-1',
  items: [],
  categories: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
});

describe('calculateBudgetTotal', () => {
  describe('calculates total for empty budgets', () => {
    it('returns 0 for budget with no items and no categories', () => {
      const budget = createEmptyBudget();
      expect(calculateBudgetTotal(budget)).toBe(0);
    });
  });

  describe('calculates total for budgets with only items', () => {
    it('calculates total from single item', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        items: [
          { _id: '1', title: 'Item 1', amountCents: 10000 },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(10000);
    });

    it('calculates total from multiple items', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        items: [
          { _id: '1', title: 'Item 1', amountCents: 10000 },
          { _id: '2', title: 'Item 2', amountCents: 20000 },
          { _id: '3', title: 'Item 3', amountCents: 5000 },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(35000);
    });

    it('handles items with zero amount', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        items: [
          { _id: '1', title: 'Item 1', amountCents: 0 },
          { _id: '2', title: 'Item 2', amountCents: 15000 },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(15000);
    });
  });

  describe('calculates total for budgets with categories and providers', () => {
    it('calculates total from single provider with single expense', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Catering',
            providers: [
              {
                _id: 'prov-1',
                name: 'Restaurant A',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Service',
                    value: '500',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(50000);
    });

    it('calculates total from multiple providers with multiple expenses', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Catering',
            providers: [
              {
                _id: 'prov-1',
                name: 'Restaurant A',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Food',
                    value: '200',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                  {
                    _id: 'field-2',
                    label: 'Drinks',
                    value: '150',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
              {
                _id: 'prov-2',
                name: 'Restaurant B',
                fields: [
                  {
                    _id: 'field-3',
                    label: 'Service',
                    value: '100',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(45000);
    });

    it('ignores non-expense fields', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Venue',
            providers: [
              {
                _id: 'prov-1',
                name: 'Venue A',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Cost',
                    value: '1000',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                  {
                    _id: 'field-2',
                    label: 'Contact',
                    value: 'John Doe',
                    fieldType: 'text',
                    itemType: 'note',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(100000);
    });

    it('ignores non-currency expense fields', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Photography',
            providers: [
              {
                _id: 'prov-1',
                name: 'Photo Studio',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Package',
                    value: '500',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                  {
                    _id: 'field-2',
                    label: 'Notes',
                    value: 'Extra 200 for prints',
                    fieldType: 'text',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(50000);
    });

    it('handles decimal values in currency fields', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Flowers',
            providers: [
              {
                _id: 'prov-1',
                name: 'Florist',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Bouquet',
                    value: '123.45',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(12345);
    });

    it('handles invalid currency values', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Music',
            providers: [
              {
                _id: 'prov-1',
                name: 'DJ Service',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Service',
                    value: 'invalid',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                  {
                    _id: 'field-2',
                    label: 'Equipment',
                    value: '200',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(20000);
    });

    it('calculates total from multiple categories', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        categories: [
          {
            _id: 'cat-1',
            name: 'Catering',
            providers: [
              {
                _id: 'prov-1',
                name: 'Restaurant A',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Food',
                    value: '300',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
          {
            _id: 'cat-2',
            name: 'Venue',
            providers: [
              {
                _id: 'prov-2',
                name: 'Hall A',
                fields: [
                  {
                    _id: 'field-2',
                    label: 'Rental',
                    value: '700',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(100000);
    });
  });

  describe('calculates total for budgets with both items and categories', () => {
    it('combines items total and categories total', () => {
      const budget: SerializedBudget = {
        ...createEmptyBudget(),
        items: [
          { _id: '1', title: 'Item 1', amountCents: 15000 },
          { _id: '2', title: 'Item 2', amountCents: 25000 },
        ],
        categories: [
          {
            _id: 'cat-1',
            name: 'Catering',
            providers: [
              {
                _id: 'prov-1',
                name: 'Restaurant A',
                fields: [
                  {
                    _id: 'field-1',
                    label: 'Food',
                    value: '100',
                    fieldType: 'currency',
                    itemType: 'expense',
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateBudgetTotal(budget)).toBe(50000);
    });
  });
});

describe('getBudgetMainCategory', () => {
  it('returns first category name when categories exist', () => {
    const budget: SerializedBudget = {
      ...createEmptyBudget(),
      categories: [
        { _id: 'cat-1', name: 'Catering', providers: [] },
        { _id: 'cat-2', name: 'Venue', providers: [] },
      ],
    };

    expect(getBudgetMainCategory(budget)).toBe('Catering');
  });

  it('returns "Sem Categoria" when categories array is empty', () => {
    const budget = createEmptyBudget();
    expect(getBudgetMainCategory(budget)).toBe('Sem Categoria');
  });

  it('returns "Sem Categoria" when categories is undefined', () => {
    const budget: SerializedBudget = {
      ...createEmptyBudget(),
      categories: undefined as unknown as ICategory[],
    };

    expect(getBudgetMainCategory(budget)).toBe('Sem Categoria');
  });

  it('returns "Sem Categoria" when first category has no name', () => {
    const budget: SerializedBudget = {
      ...createEmptyBudget(),
      categories: [
        { _id: 'cat-1', name: undefined as unknown as string, providers: [] },
      ],
    };

    expect(getBudgetMainCategory(budget)).toBe('Sem Categoria');
  });
});
