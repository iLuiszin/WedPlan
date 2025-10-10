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
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary mx-auto"></div>
          <p className="mt-6 text-navy-light text-lg">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-navy-light/30 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-display font-bold text-navy mb-2">
              Projeto não encontrado
            </h2>
            <p className="text-navy-light mb-6">
              O projeto que você está procurando não existe ou foi removido.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Project Details Card */}
        <div className="bg-gradient-to-r from-white to-cream-dark rounded-2xl p-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ProjectDetailsCard project={project} />
          </div>
        </div>

        {/* Shareable URL */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <ShareableUrl projectId={projectId} />
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href={`/project/${projectId}/guests`}
            className="block bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-navy mb-2 group-hover:text-primary transition-colors">
                  Convidados
                </h2>
                <p className="text-navy-light text-sm">Gerencie a lista de convidados</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:scale-110 transition-transform"
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

            {/* Added feature highlights */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center text-navy-light text-xs">
                <svg className="w-4 h-4 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Confirmações
                <svg
                  className="w-4 h-4 mx-1 ml-3 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Acompanhantes
                <svg
                  className="w-4 h-4 mx-1 ml-3 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Categorias
              </div>
            </div>
          </Link>

          <Link
            href={`/project/${projectId}/budgets`}
            className="block bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-navy mb-2 group-hover:text-accent transition-colors">
                  Orçamentos
                </h2>
                <p className="text-navy-light text-sm">Gerencie os custos do casamento</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-accent-light/30 rounded-full flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:scale-110 transition-transform"
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

            {/* Added feature highlights */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center text-navy-light text-xs">
                <svg className="w-4 h-4 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Categorias
                <svg
                  className="w-4 h-4 mx-1 ml-3 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Fornecedores
                <svg
                  className="w-4 h-4 mx-1 ml-3 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Relatórios
              </div>
            </div>
          </Link>
        </div>

        {/* Added Quick Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6">
          <h3 className="text-lg font-display font-semibold text-navy mb-4">Visão Geral</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-display font-bold text-navy mb-1">0</div>
              <p className="text-navy-light text-xs">Convidados</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-display font-bold text-navy mb-1">R$ 0</div>
              <p className="text-navy-light text-xs">Orçamento</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-display font-bold text-navy mb-1">0</div>
              <p className="text-navy-light text-xs">Fornecedores</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-display font-bold text-navy mb-1">0%</div>
              <p className="text-navy-light text-xs">Completo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
