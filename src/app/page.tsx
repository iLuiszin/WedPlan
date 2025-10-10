'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchProjects } from '@/features/projects/components/search-projects';

const CreateProjectModal = dynamic(
  () =>
    import('@/features/projects/components/create-project-modal').then((m) => ({
      default: m.CreateProjectModal,
    })),
  { ssr: false }
);

type TabType = 'create' | 'access';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('create');

  return (
    <>
      <div className="min-h-[700px] flex flex-col items-center justify-center text-center px-4 pb-16 bg-gradient-to-b from-cream to-cream-dark">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-navy mb-4">
          Seu casamento começa com um{' '}
          <span className="font-script text-primary text-6xl md:text-8xl">plano</span>
        </h1>

        {/* react/no-unescaped-entities */}
        <p className="text-lg md:text-xl text-navy-light mb-12 max-w-2xl">
          Do &quot;sim&quot; ao altar com tudo sob controle. Organize orçamento, convidados,
          fornecedores e muito mais em um só lugar.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-primary text-white shadow-md'
                : 'text-navy-light hover:text-navy hover:bg-gray-50'
            }`}
          >
            Criar Novo Casamento
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'access'
                ? 'bg-primary text-white shadow-md'
                : 'text-navy-light hover:text-navy hover:bg-gray-50'
            }`}
          >
            Acessar Projeto
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-3xl">
          {activeTab === 'create' ? (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                Começar Agora
              </button>
              <p className="text-navy-light text-sm mt-4">
                Comece a planejar seu grande dia em segundos
              </p>
            </div>
          ) : (
            <SearchProjects variant="hero" />
          )}
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-primary"
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
            <h3 className="text-xl font-display font-semibold text-navy mb-2">
              Lista de Convidados
            </h3>
            <p className="text-navy-light text-sm leading-relaxed">
              Organize convidados, controle confirmações e gerencie acompanhantes com facilidade
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-accent-light/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-accent"
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
            <h3 className="text-xl font-display font-semibold text-navy mb-2">
              Controle Financeiro
            </h3>
            <p className="text-navy-light text-sm leading-relaxed">
              Gerencie seu orçamento, categorize gastos e acompanhe despesas em tempo real
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-navy mb-2">Compartilhamento</h3>
            <p className="text-navy-light text-sm leading-relaxed">
              Compartilhe com parceiros e colaboradores para planejar juntos seu grande dia
            </p>
          </div>
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
