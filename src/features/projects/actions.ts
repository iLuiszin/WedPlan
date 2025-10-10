'use server';

import { revalidatePath } from 'next/cache';
import { createProjectSchema, updateProjectSchema } from '@/schemas/project-schema';
import { AppError, ErrorCode } from '@/types/error-codes';
import { withAction, withValidatedAction } from '@/lib/action-wrapper';
import { createProject } from './api/create-project';
import { findProjectById } from './api/get-project';
import { updateProject } from './api/update-project';
import { deleteProject } from './api/delete-project';

const MONGODB_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const validateMongoId = (id: string): void => {
  if (!id || !MONGODB_ID_REGEX.test(id)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'Invalid project ID');
  }
};

export const createProjectAction = withValidatedAction(
  async (input: typeof createProjectSchema._output) => {
    return await createProject(input);
  },
  {
    schema: createProjectSchema,
    operationName: 'Create project',
  }
);

export const getProjectAction = withAction(
  async (projectId: string) => {
    validateMongoId(projectId);

    const project = await findProjectById(projectId);
    if (!project) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Project not found');
    }

    return project;
  },
  {
    operationName: 'Get project',
  }
);

export const updateProjectAction = withValidatedAction(
  async (input: typeof updateProjectSchema._output) => {
    const { _id, ...updates } = input;
    validateMongoId(_id);

    const project = await updateProject(_id, updates);
    if (!project) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Project not found');
    }

    revalidatePath(`/project/${_id}`);
    return project;
  },
  {
    schema: updateProjectSchema,
    operationName: 'Update project',
  }
);

export const deleteProjectAction = withAction(
  async (projectId: string) => {
    validateMongoId(projectId);

    const deleted = await deleteProject(projectId);
    if (!deleted) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Project not found');
    }
  },
  {
    revalidate: '/',
    operationName: 'Delete project',
  }
);
