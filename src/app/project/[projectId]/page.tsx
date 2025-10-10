'use client';

import Link from 'next/link';
import { useProjectContext } from '@/features/projects/components/project-context';
import { useProject } from '@/features/projects/hooks/use-project';
import { ShareableUrl } from '@/features/projects/components/shareable-url';
import { ProjectDetailsCard } from '@/features/projects/components/project-details-card';

export default function ProjectPage() {
  const { projectId } = useProjectContext();
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-navy-light">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <p className="text-navy-light">Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectDetailsCard project={project} />

      <ShareableUrl projectId={projectId} />

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href={`/project/${projectId}/guests`}
          className="block bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-navy mb-2 group-hover:text-primary transition-colors">
                Convidados
              </h2>
              <p className="text-navy-light text-sm">Gerencie a lista de convidados</p>
            </div>
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <svg
                className="w-7 h-7 text-primary group-hover:scale-110 transition-transform"
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
          </div>
        </Link>

        <Link
          href={`/project/${projectId}/budgets`}
          className="block bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg hover:border-accent/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-navy mb-2 group-hover:text-accent transition-colors">
                Orçamentos
              </h2>
              <p className="text-navy-light text-sm">Gerencie os custos do casamento</p>
            </div>
            <div className="w-14 h-14 bg-accent-light/30 rounded-full flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <svg
                className="w-7 h-7 text-accent group-hover:scale-110 transition-transform"
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
          </div>
        </Link>
      </div>
    </div>
  );
}
