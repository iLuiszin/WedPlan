import { ProjectModel, type IProject } from '@/models/project';
import { serializeDocument, type SerializedDocument } from '@/types/mongoose-helpers';

export async function findProjectById(id: string): Promise<SerializedDocument<IProject> | null> {
  const project = await ProjectModel.findById(id).exec();

  if (!project) {
    return null;
  }

  return serializeDocument(project);
}
