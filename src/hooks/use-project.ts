'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createProjectAction,
  getProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from '@/actions/project-actions';
import type { CreateProjectInput, UpdateProjectInput } from '@/schemas/project-schema';

const PROJECT_QUERY_KEY = ['project'] as const;

export function useProject(projectId: string) {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, projectId],
    queryFn: async () => {
      const result = await getProjectAction(projectId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const result = await createProjectAction(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar projeto: ${error.message}`);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProjectInput) => {
      const result = await updateProjectAction(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: [...PROJECT_QUERY_KEY, data._id.toString()] });
      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar projeto: ${error.message}`);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const result = await deleteProjectAction(projectId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_data, projectId) => {
      void queryClient.invalidateQueries({ queryKey: [...PROJECT_QUERY_KEY, projectId] });
      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir projeto: ${error.message}`);
    },
  });
}
