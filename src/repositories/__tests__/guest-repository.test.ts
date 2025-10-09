import { beforeAll, describe, expect, inject, it, vi } from 'vitest';
import mongoose from 'mongoose';
import { GuestRepository } from '../guest-repository';

vi.mock('@/lib/db', () => ({
  connectToDatabase: vi.fn(),
}));

const MONGO_URI = inject('MONGO_URI');

describe('GuestRepository', () => {
  let repository: GuestRepository;
  const testProjectId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    repository = new GuestRepository();
  });

  describe('create', () => {
    it('creates a guest successfully', async () => {
      const guestData = {
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both' as const,
        role: 'guest' as const,
      };

      const guest = await repository.create(guestData);

      expect(guest).toBeDefined();
      expect(guest._id).toBeDefined();
      expect(guest.firstName).toBe('John');
      expect(guest.lastName).toBe('Doe');
      expect(guest.category).toBe('both');
      expect(guest.role).toBe('guest');
      expect(guest.partnerId).toBeNull();
      expect(guest.createdAt).toBeDefined();
      expect(guest.updatedAt).toBeDefined();
    });

    it('creates a guest with partnerId', async () => {
      const partnerId = new mongoose.Types.ObjectId().toString();
      const guestData = {
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride' as const,
        role: 'bridesmaid' as const,
        partnerId,
      };

      const guest = await repository.create(guestData);

      expect(guest.partnerId).toBe(partnerId);
    });

    it('serializes document correctly', async () => {
      const guestData = {
        projectId: testProjectId,
        firstName: 'Test',
        lastName: 'User',
        category: 'groom' as const,
        role: 'groomsman' as const,
      };

      const guest = await repository.create(guestData);

      expect(typeof guest._id).toBe('string');
      expect(typeof guest.createdAt).toBe('string');
      expect(typeof guest.updatedAt).toBe('string');
    });
  });

  describe('findById', () => {
    it('finds existing guest by id', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      const found = await repository.findById(created._id);

      expect(found).toBeDefined();
      expect(found?._id).toBe(created._id);
      expect(found?.firstName).toBe('John');
    });

    it('returns null for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const found = await repository.findById(fakeId);

      expect(found).toBeNull();
    });

    it('returns serialized document', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        firstName: 'Test',
        lastName: 'User',
        category: 'both',
        role: 'guest',
      });

      const found = await repository.findById(created._id);

      expect(typeof found?._id).toBe('string');
      expect(typeof found?.createdAt).toBe('string');
    });
  });

  describe('findByProject', () => {
    it('returns empty array when no guests exist', async () => {
      const emptyProjectId = new mongoose.Types.ObjectId().toString();
      const guests = await repository.findByProject(emptyProjectId);

      expect(guests).toEqual([]);
    });

    it('finds all guests for a project', async () => {
      const uniqueProjectId = new mongoose.Types.ObjectId().toString();

      await repository.create({
        projectId: uniqueProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      await repository.create({
        projectId: uniqueProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'both',
        role: 'guest',
      });

      const guests = await repository.findByProject(uniqueProjectId);

      expect(guests).toHaveLength(2);
    });

    it('does not return guests from other projects', async () => {
      const uniqueProjectId = new mongoose.Types.ObjectId().toString();
      const otherProjectId = new mongoose.Types.ObjectId().toString();

      await repository.create({
        projectId: uniqueProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      await repository.create({
        projectId: otherProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'both',
        role: 'guest',
      });

      const guests = await repository.findByProject(uniqueProjectId);

      expect(guests).toHaveLength(1);
      expect(guests[0].firstName).toBe('John');
    });

    it('sorts guests by lastName and firstName', async () => {
      await repository.create({
        projectId: testProjectId,
        firstName: 'Charlie',
        lastName: 'Brown',
        category: 'both',
        role: 'guest',
      });

      await repository.create({
        projectId: testProjectId,
        firstName: 'Alice',
        lastName: 'Anderson',
        category: 'both',
        role: 'guest',
      });

      await repository.create({
        projectId: testProjectId,
        firstName: 'Bob',
        lastName: 'Anderson',
        category: 'both',
        role: 'guest',
      });

      const guests = await repository.findByProject(testProjectId);

      expect(guests[0].firstName).toBe('Alice');
      expect(guests[1].firstName).toBe('Bob');
      expect(guests[2].firstName).toBe('Charlie');
    });
  });

  describe('update', () => {
    it('updates guest successfully', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      const updated = await repository.update(created._id, {
        firstName: 'Johnny',
        role: 'groomsman',
      });

      expect(updated).toBeDefined();
      expect(updated?.firstName).toBe('Johnny');
      expect(updated?.lastName).toBe('Doe');
      expect(updated?.role).toBe('groomsman');
    });

    it('returns null when guest does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const updated = await repository.update(fakeId, {
        firstName: 'Test',
      });

      expect(updated).toBeNull();
    });

    it('updates partnerId', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      const partnerId = new mongoose.Types.ObjectId().toString();
      const updated = await repository.update(created._id, {
        partnerId,
      });

      expect(updated?.partnerId).toBe(partnerId);
    });

    it('returns serialized document', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        firstName: 'Test',
        lastName: 'User',
        category: 'both',
        role: 'guest',
      });

      const updated = await repository.update(created._id, {
        firstName: 'Updated',
      });

      expect(typeof updated?._id).toBe('string');
      expect(typeof updated?.updatedAt).toBe('string');
    });
  });

  describe('delete', () => {
    it('deletes guest successfully', async () => {
      const created = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      const result = await repository.delete(created._id);

      expect(result).toBe(true);

      const found = await repository.findById(created._id);
      expect(found).toBeNull();
    });

    it('returns false when guest does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await repository.delete(fakeId);

      expect(result).toBe(false);
    });
  });

  describe('updatePartnerId', () => {
    it('updates partnerId successfully', async () => {
      const guest = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      const partnerId = new mongoose.Types.ObjectId().toString();
      await repository.updatePartnerId(guest._id, partnerId);

      const updated = await repository.findById(guest._id);
      expect(updated?.partnerId).toBe(partnerId);
    });

    it('sets partnerId to null', async () => {
      const partnerId = new mongoose.Types.ObjectId().toString();
      const guest = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
        partnerId,
      });

      await repository.updatePartnerId(guest._id, null);

      const updated = await repository.findById(guest._id);
      expect(updated?.partnerId).toBeFalsy();
    });
  });
});
