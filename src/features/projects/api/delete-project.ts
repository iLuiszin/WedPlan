import { ProjectModel } from '@/models/project';

export async function deleteProject(id: string): Promise<boolean> {
  const result = await ProjectModel.findByIdAndDelete(id).exec();
  return result !== null;
}
