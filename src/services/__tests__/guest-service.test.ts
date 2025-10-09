import { beforeAll, describe, expect, inject, it, vi } from 'vitest';
import mongoose from 'mongoose';
import { GuestService } from '../guest-service';
import { GuestRepository } from '@/repositories/guest-repository';
import { AppError } from '@/types/error-codes';

vi.mock('@/lib/db', () => ({
  connectToDatabase: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const MONGO_URI = inject('MONGO_URI');

describe('GuestService', () => {
  let service: GuestService;
  let repository: GuestRepository;
  const testProjectId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    repository = new GuestRepository();
    service = new GuestService(repository);
  });

  describe('linkPartners', () => {
    it('links two unlinked guests successfully', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      await service.linkPartners(guestA._id, guestB._id);

      const updatedA = await repository.findById(guestA._id);
      const updatedB = await repository.findById(guestB._id);

      expect(updatedA?.partnerId).toBe(guestB._id);
      expect(updatedB?.partnerId).toBe(guestA._id);
    });

    it('throws error when trying to link guest to self', async () => {
      const guest = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      await expect(service.linkPartners(guest._id, guest._id)).rejects.toThrow(AppError);
      await expect(service.linkPartners(guest._id, guest._id)).rejects.toThrow(
        'Cannot link guest to self'
      );
    });

    it('throws error when first guest does not exist', async () => {
      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(service.linkPartners(fakeId, guestB._id)).rejects.toThrow(AppError);
      await expect(service.linkPartners(fakeId, guestB._id)).rejects.toThrow(
        'One or both guests not found'
      );
    });

    it('throws error when second guest does not exist', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(service.linkPartners(guestA._id, fakeId)).rejects.toThrow(AppError);
      await expect(service.linkPartners(guestA._id, fakeId)).rejects.toThrow(
        'One or both guests not found'
      );
    });

    it('unlinks previous partner when linking to new partner', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      const guestC = await repository.create({
        projectId: testProjectId,
        firstName: 'Alice',
        lastName: 'Johnson',
        category: 'bride',
        role: 'guest',
      });

      await service.linkPartners(guestA._id, guestB._id);
      await service.linkPartners(guestA._id, guestC._id);

      const updatedA = await repository.findById(guestA._id);
      const updatedB = await repository.findById(guestB._id);
      const updatedC = await repository.findById(guestC._id);

      expect(updatedA?.partnerId).toBe(guestC._id);
      expect(updatedB?.partnerId).toBeFalsy();
      expect(updatedC?.partnerId).toBe(guestA._id);
    });

    it('handles relinking already linked guests', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      await service.linkPartners(guestA._id, guestB._id);
      await service.linkPartners(guestA._id, guestB._id);

      const updatedA = await repository.findById(guestA._id);
      const updatedB = await repository.findById(guestB._id);

      expect(updatedA?.partnerId).toBe(guestB._id);
      expect(updatedB?.partnerId).toBe(guestA._id);
    });

    it('unlinks both previous partners when linking two already-linked guests', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      const guestC = await repository.create({
        projectId: testProjectId,
        firstName: 'Alice',
        lastName: 'Johnson',
        category: 'bride',
        role: 'guest',
      });

      const guestD = await repository.create({
        projectId: testProjectId,
        firstName: 'Bob',
        lastName: 'Williams',
        category: 'groom',
        role: 'guest',
      });

      await service.linkPartners(guestA._id, guestB._id);
      await service.linkPartners(guestC._id, guestD._id);
      await service.linkPartners(guestA._id, guestC._id);

      const updatedA = await repository.findById(guestA._id);
      const updatedB = await repository.findById(guestB._id);
      const updatedC = await repository.findById(guestC._id);
      const updatedD = await repository.findById(guestD._id);

      expect(updatedA?.partnerId).toBe(guestC._id);
      expect(updatedB?.partnerId).toBeFalsy();
      expect(updatedC?.partnerId).toBe(guestA._id);
      expect(updatedD?.partnerId).toBeFalsy();
    });
  });

  describe('unlinkPartner', () => {
    it('unlinks guest from their partner successfully', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      await service.linkPartners(guestA._id, guestB._id);
      await service.unlinkPartner(guestA._id);

      const updatedA = await repository.findById(guestA._id);
      const updatedB = await repository.findById(guestB._id);

      expect(updatedA?.partnerId).toBeFalsy();
      expect(updatedB?.partnerId).toBeFalsy();
    });

    it('throws error when guest does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(service.unlinkPartner(fakeId)).rejects.toThrow(AppError);
      await expect(service.unlinkPartner(fakeId)).rejects.toThrow('Guest not found');
    });

    it('handles unlinking guest with no partner', async () => {
      const guest = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'both',
        role: 'guest',
      });

      await service.unlinkPartner(guest._id);

      const updated = await repository.findById(guest._id);
      expect(updated?.partnerId).toBeFalsy();
    });

    it('unlinks bidirectionally', async () => {
      const guestA = await repository.create({
        projectId: testProjectId,
        firstName: 'John',
        lastName: 'Doe',
        category: 'groom',
        role: 'guest',
      });

      const guestB = await repository.create({
        projectId: testProjectId,
        firstName: 'Jane',
        lastName: 'Smith',
        category: 'bride',
        role: 'guest',
      });

      await service.linkPartners(guestA._id, guestB._id);
      await service.unlinkPartner(guestB._id);

      const updatedA = await repository.findById(guestA._id);
      const updatedB = await repository.findById(guestB._id);

      expect(updatedA?.partnerId).toBeFalsy();
      expect(updatedB?.partnerId).toBeFalsy();
    });
  });
});
