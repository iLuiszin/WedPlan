'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const CreateProjectModal = dynamic(
  () => import('@/features/projects/components/create-project-modal').then(m => ({ default: m.CreateProjectModal })),
  { ssr: false }
);

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">WedPlan</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          Organize seu casamento de forma simples e colaborativa. Gerencie convidados, orçamentos e
          muito mais.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 duration-200"
        >
          Criar Novo Casamento
        </button>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl">
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
