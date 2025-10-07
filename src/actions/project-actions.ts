'use server';

import { revalidatePath } from 'next/cache';
import type { Document } from 'mongoose';
import { ProjectModel } from '@/models/project';
import { createProjectSchema, updateProjectSchema } from '@/schemas/project-schema';
import { connectToDatabase } from '@/lib/db';
import type { ActionResponse } from '@/types/action-response';
import type { IProject } from '@/models/project';

function serializeProject(project: Document & IProject): IProject {
  return JSON.parse(JSON.stringify(project.toObject()));
}

export async function createProjectAction(input: unknown): Promise<ActionResponse<IProject>> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const project = await ProjectModel.create(parsed.data);
    return { success: true, data: serializeProject(project) };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project', code: 'DB_ERROR' };
  }
}

export async function getProjectAction(projectId: string): Promise<ActionResponse<IProject>> {
  if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
    return { success: false, error: 'Invalid project ID', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return { success: false, error: 'Project not found', code: 'NOT_FOUND' };
    }
    return { success: true, data: serializeProject(project) };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: 'Failed to fetch project', code: 'DB_ERROR' };
  }
}

export async function updateProjectAction(input: unknown): Promise<ActionResponse<IProject>> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    const { _id, ...updates } = parsed.data;
    if (!_id || !/^[0-9a-fA-F]{24}$/.test(_id)) {
      return { success: false, error: 'Invalid project ID', code: 'VALIDATION_ERROR' };
    }

    //@ts-expect-error - Mongoose typing complexity
    const project = await ProjectModel.findByIdAndUpdate(_id, updates, { new: true });
    if (!project) {
      return { success: false, error: 'Project not found', code: 'NOT_FOUND' };
    }
    revalidatePath(`/project/${_id}`);
    return { success: true, data: serializeProject(project) };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project', code: 'DB_ERROR' };
  }
}

export async function deleteProjectAction(projectId: string): Promise<ActionResponse<void>> {
  if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
    return { success: false, error: 'Invalid project ID', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const project = await ProjectModel.findByIdAndDelete(projectId);
    if (!project) {
      return { success: false, error: 'Project not found', code: 'NOT_FOUND' };
    }
    revalidatePath('/');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project', code: 'DB_ERROR' };
  }
}
