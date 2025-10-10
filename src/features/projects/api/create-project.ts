import { ProjectModel, type IProject } from '@/models/project';
import type { CreateProjectInput } from '@/schemas/project-schema';
import { serializeDocument, type SerializedDocument } from '@/types/mongoose-helpers';

export async function createProject(data: CreateProjectInput): Promise<SerializedDocument<IProject>> {
  const project = await ProjectModel.create(data);
  return serializeDocument(project);
}
