import type { IProject } from '@/models/project';
import type { SerializedDocument } from '@/types/mongoose-helpers';

export type SerializedProject = SerializedDocument<IProject>;

export type { IProject };
export type {
  CreateProjectInput,
  UpdateProjectInput,
} from '@/schemas/project-schema';
