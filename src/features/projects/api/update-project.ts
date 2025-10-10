import { ProjectModel, type IProject } from '@/models/project';
import type { UpdateProjectInput } from '@/schemas/project-schema';
import { serializeDocument, type SerializedDocument } from '@/types/mongoose-helpers';

export async function updateProject(
  id: string,
  updates: Omit<UpdateProjectInput, '_id'>
): Promise<SerializedDocument<IProject> | null> {
  const project = await ProjectModel.findByIdAndUpdate(id, updates, { new: true }).exec();

  if (!project) {
    return null;
  }

  return serializeDocument(project);
}
