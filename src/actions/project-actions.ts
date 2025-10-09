'use server';

import { revalidatePath } from 'next/cache';
import { createProjectSchema, updateProjectSchema } from '@/schemas/project-schema';
import type { ActionResponse } from '@/types/action-response';
import type { IProject } from '@/models/project';
import type { SerializedDocument } from '@/types/mongoose-helpers';
import { ProjectRepository } from '@/repositories/project-repository';
import { ErrorCode } from '@/types/error-codes';
import { logger } from '@/lib/logger';

const projectRepository = new ProjectRepository();

export async function createProjectAction(
  input: unknown
): Promise<ActionResponse<SerializedDocument<IProject>>> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const project = await projectRepository.create(parsed.data);
    return { success: true, data: project };
  } catch (error) {
    logger.error('Failed to create project', error as Error, { input: parsed.data });
    return { success: false, error: 'Failed to create project', code: ErrorCode.DB_ERROR };
  }
}

export async function getProjectAction(
  projectId: string
): Promise<ActionResponse<SerializedDocument<IProject>>> {
  if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
    return { success: false, error: 'Invalid project ID', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return { success: false, error: 'Project not found', code: ErrorCode.NOT_FOUND };
    }
    return { success: true, data: project };
  } catch (error) {
    logger.error('Failed to fetch project', error as Error, { projectId });
    return { success: false, error: 'Failed to fetch project', code: ErrorCode.DB_ERROR };
  }
}

export async function updateProjectAction(
  input: unknown
): Promise<ActionResponse<SerializedDocument<IProject>>> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const { _id, ...updates } = parsed.data;
    if (!_id || !/^[0-9a-fA-F]{24}$/.test(_id)) {
      return { success: false, error: 'Invalid project ID', code: ErrorCode.VALIDATION_ERROR };
    }

    const project = await projectRepository.update(_id, updates);
    if (!project) {
      return { success: false, error: 'Project not found', code: ErrorCode.NOT_FOUND };
    }

    revalidatePath(`/project/${_id}`);
    return { success: true, data: project };
  } catch (error) {
    logger.error('Failed to update project', error as Error, { input: parsed.data });
    return { success: false, error: 'Failed to update project', code: ErrorCode.DB_ERROR };
  }
}

export async function deleteProjectAction(projectId: string): Promise<ActionResponse<void>> {
  if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
    return { success: false, error: 'Invalid project ID', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const deleted = await projectRepository.delete(projectId);
    if (!deleted) {
      return { success: false, error: 'Project not found', code: ErrorCode.NOT_FOUND };
    }

    revalidatePath('/');
    return { success: true, data: undefined };
  } catch (error) {
    logger.error('Failed to delete project', error as Error, { projectId });
    return { success: false, error: 'Failed to delete project', code: ErrorCode.DB_ERROR };
  }
}
