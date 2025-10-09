import { beforeAll, describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';
import { BudgetRepository } from '../budget-repository';
import { requireAt, requireDefined } from '../../../tests/utils/array';

vi.mock('@/lib/db', () => ({
  connectToDatabase: vi.fn(),
}));

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error('MONGODB_URI must be defined for repository tests');
}

describe('BudgetRepository', () => {
  let repository: BudgetRepository;
  const testProjectId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    repository = new BudgetRepository();
  });

  describe('create', () => {
    it('creates an empty budget successfully', async () => {
      const budgetData = {
        projectId: testProjectId,
        items: [],
        categories: [],
      };

      const budget = await repository.create(budgetData);

      expect(budget).toBeDefined();
      expect(budget._id).toBeDefined();
      expect(budget.projectId).toBe(testProjectId);
      expect(budget.items).toEqual([]);
      expect(budget.categories).toEqual([]);
      expect(budget.createdAt).toBeDefined();
      expect(budget.updatedAt).toBeDefined();
    });

    it('creates a budget with items', async () => {
      const budgetData = {
        projectId: testProjectId,
        items: [
          { title: 'Venue', amountCents: 100000 },
          { title: 'Catering', amountCents: 50000 },
        ],
        categories: [],
      };

      const budget = await repository.create(budgetData);

      expect(budget.items).toHaveLength(2);
      const firstItem = requireAt(budget.items, 0);
      const secondItem = requireAt(budget.items, 1);

      expect(firstItem.title).toBe('Venue');
      expect(firstItem.amountCents).toBe(100000);
      expect(secondItem.title).toBe('Catering');
      expect(secondItem.amountCents).toBe(50000);
    });

    it('creates a budget with categories and providers', async () => {
      const budgetData = {
        projectId: testProjectId,
        items: [],
        categories: [
          {
            name: 'Photography',
            providers: [
              {
                name: 'Photo Studio A',
                fields: [
                  {
                    key: 'Package',
                    value: '500',
                    fieldType: 'currency' as const,
                    itemType: 'expense' as const,
                  },
                ],
                notes: 'Great portfolio',
                amountCents: 50000,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          },
        ],
      };

      const budget = await repository.create(budgetData);

      expect(budget.categories).toHaveLength(1);
      const category = requireAt(budget.categories, 0);

      expect(category.name).toBe('Photography');
      expect(category.providers).toHaveLength(1);

      const provider = requireAt(category.providers, 0);
      expect(provider.name).toBe('Photo Studio A');
      expect(provider.fields).toHaveLength(1);
      expect(provider.amountCents).toBe(50000);
    });

    it('serializes document correctly', async () => {
      const budgetData = {
        projectId: testProjectId,
        items: [{ title: 'Test', amountCents: 1000 }],
        categories: [],
      };

      const budget = await repository.create(budgetData);

      expect(typeof budget._id).toBe('string');
      expect(typeof budget.createdAt).toBe('string');
      expect(typeof budget.updatedAt).toBe('string');

      const firstItem = requireAt(budget.items, 0);
      expect(typeof firstItem._id).toBe('string');
    });
  });

  describe('findById', () => {
    it('finds existing budget by id', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        items: [{ title: 'Test Item', amountCents: 5000 }],
        categories: [],
      });

      const found = await repository.findById(created._id);

      const budget = requireDefined(found);
      expect(budget._id).toBe(created._id);
      expect(budget.items).toHaveLength(1);

      const firstItem = requireAt(budget.items, 0);
      expect(firstItem.title).toBe('Test Item');
    });

    it('returns null for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const found = await repository.findById(fakeId);

      expect(found).toBeNull();
    });

    it('returns serialized document', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        items: [],
        categories: [],
      });

      const found = await repository.findById(created._id);

      expect(typeof found?._id).toBe('string');
      expect(typeof found?.createdAt).toBe('string');
    });
  });

  describe('findByProject', () => {
    it('returns empty array when no budgets exist', async () => {
      const emptyProjectId = new mongoose.Types.ObjectId().toString();
      const budgets = await repository.findByProject(emptyProjectId);

      expect(budgets).toEqual([]);
    });

    it('finds all budgets for a project', async () => {
      const uniqueProjectId = new mongoose.Types.ObjectId().toString();

      await repository.create({
        projectId: uniqueProjectId,
        items: [{ title: 'Item 1', amountCents: 1000 }],
        categories: [],
      });

      await repository.create({
        projectId: uniqueProjectId,
        items: [{ title: 'Item 2', amountCents: 2000 }],
        categories: [],
      });

      const budgets = await repository.findByProject(uniqueProjectId);

      expect(budgets).toHaveLength(2);
    });

    it('does not return budgets from other projects', async () => {
      const uniqueProjectId = new mongoose.Types.ObjectId().toString();
      const otherProjectId = new mongoose.Types.ObjectId().toString();

      await repository.create({
        projectId: uniqueProjectId,
        items: [{ title: 'My Budget', amountCents: 1000 }],
        categories: [],
      });

      await repository.create({
        projectId: otherProjectId,
        items: [{ title: 'Other Budget', amountCents: 2000 }],
        categories: [],
      });

      const budgets = await repository.findByProject(uniqueProjectId);

      expect(budgets).toHaveLength(1);
      const firstBudget = requireAt(budgets, 0);
      const firstItem = requireAt(firstBudget.items, 0);
      expect(firstItem.title).toBe('My Budget');
    });

    it('sorts budgets by createdAt descending', async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));

      const budgets = await repository.findByProject(testProjectId);

      expect(budgets).toHaveLength(3);

      const firstBudget = requireAt(budgets, 0);
      const secondBudget = requireAt(budgets, 1);
      const thirdBudget = requireAt(budgets, 2);

      expect(requireAt(firstBudget.items, 0).title).toBe('Third');
      expect(requireAt(secondBudget.items, 0).title).toBe('Second');
      expect(requireAt(thirdBudget.items, 0).title).toBe('First');
    });
  });

  describe('update', () => {
    it('updates budget successfully', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        items: [{ title: 'Original', amountCents: 1000 }],
        categories: [],
      });

      const updated = await repository.update(created._id, {
        items: [
          { title: 'Updated', amountCents: 2000 },
          { title: 'New Item', amountCents: 3000 },
        ],
      });

      const updatedBudget = requireDefined(updated);
      expect(updatedBudget.items).toHaveLength(2);

      const firstItem = requireAt(updatedBudget.items, 0);
      const secondItem = requireAt(updatedBudget.items, 1);
      expect(firstItem.title).toBe('Updated');
      expect(secondItem.title).toBe('New Item');
    });

    it('returns null when budget does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const updated = await repository.update(fakeId, {
        items: [{ title: 'Test', amountCents: 1000 }],
      });

      expect(updated).toBeNull();
    });

    it('updates categories', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        items: [],
        categories: [],
      });

      const updated = await repository.update(created._id, {
        categories: [
          {
            name: 'New Category',
            providers: [
              {
                name: 'New Provider',
                fields: [],
                notes: 'Test notes',
                amountCents: 5000,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          },
        ],
      });

      const updatedBudget = requireDefined(updated);
      expect(updatedBudget.categories).toHaveLength(1);

      const updatedCategory = requireAt(updatedBudget.categories, 0);
      expect(updatedCategory.name).toBe('New Category');

      const updatedProvider = requireAt(updatedCategory.providers, 0);
      expect(updatedProvider.name).toBe('New Provider');
    });

    it('returns serialized document', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        items: [],
        categories: [],
      });

      const updated = await repository.update(created._id, {
        items: [{ title: 'Test', amountCents: 1000 }],
      });

      const updatedBudget = requireDefined(updated);
      expect(typeof updatedBudget._id).toBe('string');
      expect(typeof updatedBudget.updatedAt).toBe('string');
    });
  });

  describe('delete', () => {
    it('deletes budget successfully', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        items: [],
        categories: [],
      });

      const result = await repository.delete(created._id);

      expect(result).toBe(true);

      const found = await repository.findById(created._id);
      expect(found).toBeNull();
    });

    it('returns false when budget does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await repository.delete(fakeId);

      expect(result).toBe(false);
    });
  });
});
