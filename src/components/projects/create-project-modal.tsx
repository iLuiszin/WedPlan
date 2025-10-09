'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, type CreateProjectInput } from '@/schemas/project-schema';
import { useCreateProject } from '@/hooks/use-project';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const createProject = useCreateProject();
  const [weddingDate, setWeddingDate] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: CreateProjectInput) => {
    const project = await createProject.mutateAsync({
      ...data,
      weddingDate: weddingDate ? new Date(weddingDate + 'T12:00:00.000Z') : null,
    });

    reset();
    setWeddingDate('');
    onClose();
    router.push(`/project/${project._id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Criar Novo Casamento</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="brideFirstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Noiva
            </label>
            <input
              id="brideFirstName"
              type="text"
              {...register('brideFirstName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.brideFirstName && (
              <p className="text-red-500 text-sm mt-1">{errors.brideFirstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="brideLastName" className="block text-sm font-medium text-gray-700 mb-1">
              Sobrenome da Noiva
            </label>
            <input
              id="brideLastName"
              type="text"
              {...register('brideLastName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.brideLastName && (
              <p className="text-red-500 text-sm mt-1">{errors.brideLastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="groomFirstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Noivo
            </label>
            <input
              id="groomFirstName"
              type="text"
              {...register('groomFirstName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.groomFirstName && (
              <p className="text-red-500 text-sm mt-1">{errors.groomFirstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="groomLastName" className="block text-sm font-medium text-gray-700 mb-1">
              Sobrenome do Noivo
            </label>
            <input
              id="groomLastName"
              type="text"
              {...register('groomLastName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.groomLastName && (
              <p className="text-red-500 text-sm mt-1">{errors.groomLastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data do Casamento (opcional)
            </label>
            <input
              id="weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createProject.isPending}
              className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProject.isPending ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
