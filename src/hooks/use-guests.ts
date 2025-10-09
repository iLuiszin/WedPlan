'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createGuestAction,
  updateGuestAction,
  deleteGuestAction,
  linkPartnersAction,
  unlinkPartnerAction,
  getGuestsAction,
} from '@/actions/guest-actions';
import type { CreateGuestInput, UpdateGuestInput } from '@/schemas/guest-schema';

const GUESTS_QUERY_KEY = ['guests'] as const;

export function useGuests(projectId: string, options = {}) {
  return useQuery({
    queryKey: [...GUESTS_QUERY_KEY, projectId],
    queryFn: async () => {
      const result = await getGuestsAction(projectId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGuestInput) => {
      const result = await createGuestAction(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Convidado adicionado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar convidado: ${error.message}`);
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateGuestInput) => {
      const result = await updateGuestAction(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Convidado atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar convidado: ${error.message}`);
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteGuestAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Convidado removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover convidado: ${error.message}`);
    },
  });
}

export function useLinkPartners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ aId, bId }: { aId: string; bId: string }) => {
      const result = await linkPartnersAction(aId, bId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Parceiros vinculados com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao vincular parceiros: ${error.message}`);
    },
  });
}

export function useUnlinkPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await unlinkPartnerAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Parceiro desvinculado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desvincular parceiro: ${error.message}`);
    },
  });
}
