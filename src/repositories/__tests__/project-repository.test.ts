import { beforeAll, describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';
import { ProjectRepository } from '../project-repository';

vi.mock('@/lib/db', () => ({
  connectToDatabase: vi.fn(),
}));

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error('MONGODB_URI must be defined for repository tests');
}

describe('ProjectRepository', () => {
  let repository: ProjectRepository;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    repository = new ProjectRepository();
  });

  describe('create', () => {
    it('creates a project successfully', async () => {
      const projectData = {
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: null,
      };

      const project = await repository.create(projectData);

      expect(project).toBeDefined();
      expect(project._id).toBeDefined();
      expect(project.brideFirstName).toBe('Jane');
      expect(project.brideLastName).toBe('Smith');
      expect(project.groomFirstName).toBe('John');
      expect(project.groomLastName).toBe('Doe');
      expect(project.weddingDate).toBeNull();
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBeDefined();
    });

    it('creates a project with wedding date', async () => {
      const weddingDate = new Date('2025-06-15');
      const projectData = {
        brideFirstName: 'Alice',
        brideLastName: 'Johnson',
        groomFirstName: 'Bob',
        groomLastName: 'Williams',
        weddingDate,
      };

      const project = await repository.create(projectData);

      expect(project.weddingDate).toBeDefined();
      expect(new Date(project.weddingDate!).toISOString()).toBe(weddingDate.toISOString());
    });

    it('trims whitespace from names', async () => {
      const projectData = {
        brideFirstName: '  Jane  ',
        brideLastName: '  Smith  ',
        groomFirstName: '  John  ',
        groomLastName: '  Doe  ',
        weddingDate: null,
      };

      const project = await repository.create(projectData);

      expect(project.brideFirstName).toBe('Jane');
      expect(project.brideLastName).toBe('Smith');
      expect(project.groomFirstName).toBe('John');
      expect(project.groomLastName).toBe('Doe');
    });

    it('serializes document correctly', async () => {
      const projectData = {
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: new Date('2025-06-15'),
      };

      const project = await repository.create(projectData);

      expect(typeof project._id).toBe('string');
      expect(typeof project.createdAt).toBe('string');
      expect(typeof project.updatedAt).toBe('string');
      expect(typeof project.weddingDate).toBe('string');
    });
  });

  describe('findById', () => {
    it('finds existing project by id', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: null,
      });

      const found = await repository.findById(created._id);

      expect(found).toBeDefined();
      expect(found?._id).toBe(created._id);
      expect(found?.brideFirstName).toBe('Jane');
      expect(found?.groomFirstName).toBe('John');
    });

    it('returns null for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const found = await repository.findById(fakeId);

      expect(found).toBeNull();
    });

    it('returns serialized document', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: new Date('2025-06-15'),
      });

      const found = await repository.findById(created._id);

      expect(typeof found?._id).toBe('string');
      expect(typeof found?.createdAt).toBe('string');
      expect(typeof found?.weddingDate).toBe('string');
    });
  });

  describe('update', () => {
    it('updates project successfully', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: null,
      });

      const updated = await repository.update(created._id, {
        brideFirstName: 'Janet',
        weddingDate: new Date('2025-07-20'),
      });

      expect(updated).toBeDefined();
      expect(updated?.brideFirstName).toBe('Janet');
      expect(updated?.brideLastName).toBe('Smith');
      expect(updated?.weddingDate).toBeDefined();
    });

    it('returns null when project does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const updated = await repository.update(fakeId, {
        brideFirstName: 'Test',
      });

      expect(updated).toBeNull();
    });

    it('updates wedding date to null', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: new Date('2025-06-15'),
      });

      const updated = await repository.update(created._id, {
        weddingDate: null,
      });

      expect(updated?.weddingDate).toBeNull();
    });

    it('updates all names at once', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: null,
      });

      const updated = await repository.update(created._id, {
        brideFirstName: 'Alice',
        brideLastName: 'Johnson',
        groomFirstName: 'Bob',
        groomLastName: 'Williams',
      });

      expect(updated?.brideFirstName).toBe('Alice');
      expect(updated?.brideLastName).toBe('Johnson');
      expect(updated?.groomFirstName).toBe('Bob');
      expect(updated?.groomLastName).toBe('Williams');
    });

    it('returns serialized document', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: null,
      });

      const updated = await repository.update(created._id, {
        brideFirstName: 'Janet',
      });

      expect(typeof updated?._id).toBe('string');
      expect(typeof updated?.updatedAt).toBe('string');
    });
  });

  describe('delete', () => {
    it('deletes project successfully', async () => {
      const created = await repository.create({
        brideFirstName: 'Jane',
        brideLastName: 'Smith',
        groomFirstName: 'John',
        groomLastName: 'Doe',
        weddingDate: null,
      });

      const result = await repository.delete(created._id);

      expect(result).toBe(true);

      const found = await repository.findById(created._id);
      expect(found).toBeNull();
    });

    it('returns false when project does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await repository.delete(fakeId);

      expect(result).toBe(false);
    });
  });
});
