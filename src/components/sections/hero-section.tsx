'use client';

import { SearchProjects } from '@/features/projects/components/search-projects';

interface HeroSectionProps {
  activeTab: 'create' | 'access';
  setActiveTab: (tab: 'create' | 'access') => void;
  onCreateProject: () => void;
  onLogin: () => void;
  onScrollToNext: () => void;
}

export function HeroSection({
  activeTab,
  setActiveTab,
  onCreateProject,
  onLogin,
  onScrollToNext,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Enhanced Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-dark to-secondary/10">
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-primary/5 rounded-full blur-2xl animate-pulse delay-700"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #FF7A6B 2px, transparent 2px), 
                               radial-gradient(circle at 75% 75%, #F4A261 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Main heading with balanced typography */}
        <div className="mb-8">
          <div className="space-y-2 mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-navy leading-tight">
              Seu casamento
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-navy">
                começa com um
              </span>
              <span className="font-script text-primary text-5xl sm:text-6xl md:text-7xl lg:text-8xl animate-pulse drop-shadow-lg">
                plano
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-navy-light mb-10 max-w-3xl mx-auto leading-relaxed">
          Do <span className="font-semibold text-primary">"sim"</span> ao altar com tudo sob
          controle.
          <br className="hidden md:block" />
          Organize orçamento, convidados, fornecedores e muito mais em um só lugar.
        </p>

        {/* Enhanced tab switcher */}
        <div className="flex gap-2 mb-10 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg transform scale-105'
                : 'text-navy-light hover:text-navy hover:bg-white/70'
            }`}
          >
            Criar Novo Casamento
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
              activeTab === 'access'
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg transform scale-105'
                : 'text-navy-light hover:text-navy hover:bg-white/70'
            }`}
          >
            Acessar Projeto
          </button>
        </div>

        {/* Enhanced tab content */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          {activeTab === 'create' ? (
            <div className="flex flex-col items-center space-y-6">
              <button
                onClick={onCreateProject}
                className="group px-12 py-4 bg-gradient-to-r from-primary to-accent text-white text-lg md:text-xl font-bold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center gap-3">
                  Começar Agora
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
              <p className="text-navy-light text-base">
                Comece a planejar seu grande dia em segundos
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-navy-light text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Grátis para começar
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sem cartão de crédito
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Setup em 2 minutos
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 max-w-xl mx-auto">
              <SearchProjects variant="hero" />
              <div className="mt-6 text-center">
                <p className="text-navy-light mb-4">Não tem uma conta ainda?</p>
                <button
                  onClick={onLogin}
                  className="text-primary hover:text-primary-dark font-semibold transition-colors hover:underline"
                >
                  Fazer login ou criar conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed scroll indicator with stable hover behavior */}
      <button
        onClick={onScrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform-gpu group cursor-pointer z-20 motion-safe:animate-bounce"
        aria-label="Rolar para próxima seção"
      >
        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:shadow-xl">
          <svg
            className="w-6 h-6 text-navy transition-colors duration-300 group-hover:text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>
    </section>
  );
}
