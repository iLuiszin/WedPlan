'use client';

import Link from 'next/link';
import { useProjectContext } from '@/components/projects/project-context';
import { useProject } from '@/hooks/use-project';
import { ShareableUrl } from '@/components/projects/shareable-url';

export default function ProjectPage() {
  const { projectId } = useProjectContext();
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Projeto não encontrado</p>
      </div>
    );
  }

  const formattedDate = project.weddingDate
    ? new Date(project.weddingDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'Data não definida';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {project.brideFirstName} & {project.groomFirstName}
          </h1>
          <p className="text-lg text-gray-600">{formattedDate}</p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-sm text-gray-600">Noiva</p>
            <p className="text-lg font-semibold text-gray-800">
              {project.brideFirstName} {project.brideLastName}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Noivo</p>
            <p className="text-lg font-semibold text-gray-800">
              {project.groomFirstName} {project.groomLastName}
            </p>
          </div>
        </div>
      </div>

      <ShareableUrl projectId={projectId} />

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href={`/project/${projectId}/guests`}
          className="block bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                Convidados
              </h2>
              <p className="text-gray-600">Gerencie a lista de convidados</p>
            </div>
            <svg
              className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </Link>

        <Link
          href={`/project/${projectId}/budgets`}
          className="block bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                Orçamentos
              </h2>
              <p className="text-gray-600">Gerencie os custos do casamento</p>
            </div>
            <svg
              className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
