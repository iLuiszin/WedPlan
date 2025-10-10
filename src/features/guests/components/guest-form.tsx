'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGuestSchema, type CreateGuestInput } from '@/schemas/guest-schema';
import { useCreateGuest } from '../hooks/use-guests';
import { GUEST_CATEGORIES, GUEST_ROLES } from '@/lib/constants';
import { useState } from 'react';

interface GuestFormProps {
  projectId: string;
}

export function GuestForm({ projectId }: GuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createGuest = useCreateGuest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createGuestSchema),
    defaultValues: {
      projectId,
      firstName: '',
      lastName: '',
      category: GUEST_CATEGORIES.BOTH,
      role: GUEST_ROLES.GUEST,
    },
  });

  const onSubmit = async (data: CreateGuestInput) => {
    setIsSubmitting(true);
    try {
      await createGuest.mutateAsync(data);
      reset();
    } catch (error) {
      console.error('Error creating guest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg p-6 shadow-sm mb-6 flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-4">Adicionar Convidado</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            {...register('firstName')}
            id="firstName"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nome"
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Sobrenome
          </label>
          <input
            {...register('lastName')}
            id="lastName"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Sobrenome"
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            {...register('category')}
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value={GUEST_CATEGORIES.BOTH}>Ambos</option>
            <option value={GUEST_CATEGORIES.GROOM}>Noivo</option>
            <option value={GUEST_CATEGORIES.BRIDE}>Noiva</option>
          </select>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Função
          </label>
          <select
            {...register('role')}
            id="role"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value={GUEST_ROLES.GUEST}>Convidado</option>
            <option value={GUEST_ROLES.GROOMSMAN}>Padrinho</option>
            <option value={GUEST_ROLES.BRIDESMAID}>Madrinha</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
      >
        {isSubmitting ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}
