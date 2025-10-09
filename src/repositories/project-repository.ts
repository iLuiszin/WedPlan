import { ProjectModel, type IProject } from '@/models/project';
import { connectToDatabase } from '@/lib/db';
import type { CreateProjectInput, UpdateProjectInput } from '@/schemas/project-schema';
import { serializeDocument, type SerializedDocument } from '@/types/mongoose-helpers';

export class ProjectRepository {
  async create(data: CreateProjectInput): Promise<SerializedDocument<IProject>> {
    await connectToDatabase();
    const project = await ProjectModel.create(data);
    return serializeDocument(project);
  }

  async findById(id: string): Promise<SerializedDocument<IProject> | null> {
    await connectToDatabase();
    const project = await ProjectModel.findById(id).exec();

    if (!project) {
      return null;
    }

    return serializeDocument(project);
  }

  async update(
    id: string,
    updates: Omit<UpdateProjectInput, '_id'>
  ): Promise<SerializedDocument<IProject> | null> {
    await connectToDatabase();
    const project = await ProjectModel.findByIdAndUpdate(id, updates, { new: true }).exec();

    if (!project) {
      return null;
    }

    return serializeDocument(project);
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await ProjectModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
