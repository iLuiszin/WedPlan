import { ProjectModel, type IProject } from '@/models/project';
import {
  serializeDocuments,
  type SerializedDocument,
  type MongooseDocument,
} from '@/types/mongoose-helpers';

export async function searchProjects(query: string): Promise<SerializedDocument<IProject>[]> {
  const q = query.trim();
  if (!q) return [];

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  const projects = await ProjectModel.find({
    $or: [
      { slug: regex },
      { brideFirstName: regex },
      { brideLastName: regex },
      { groomFirstName: regex },
      { groomLastName: regex },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec();

  return serializeDocuments<IProject>(projects as unknown as MongooseDocument<IProject>[]);
}
