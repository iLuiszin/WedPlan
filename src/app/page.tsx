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
      <div className="min-h-[700px] flex flex-col items-center justify-center text-center px-4 pb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">WedPlan</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
          Organize seu casamento de forma simples e colaborativa. Gerencie convidados, orçamentos e
          muito mais.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-white text-primary shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Criar Novo Casamento
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'access'
                ? 'bg-white text-primary shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/5'
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
                className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 duration-200"
              >
                Começar Agora
              </button>
              <p className="text-white/70 text-sm mt-4">
                Comece a planejar seu grande dia em segundos
              </p>
            </div>
          ) : (
            <SearchProjects variant="hero" />
          )}
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">Convidados</h3>
            <p className="text-white/80">Gerencie sua lista de convidados com facilidade</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">Orçamentos</h3>
            <p className="text-white/80">Controle todos os custos do seu casamento</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">Compartilhamento</h3>
            <p className="text-white/80">Compartilhe com parceiros e colaboradores</p>
          </div>
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
