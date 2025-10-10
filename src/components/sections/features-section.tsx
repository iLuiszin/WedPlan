import { forwardRef } from 'react';

export const FeaturesSection = forwardRef<HTMLDivElement>((props, ref) => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: 'Lista de Convidados',
      description: 'Organize convidados, controle confirmações e gerencie acompanhantes',
      color: 'bg-secondary/20',
      iconColor: 'text-primary',
      stats: '500+ convidados',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Controle Financeiro',
      description: 'Gerencie orçamento, categorize gastos e acompanhe despesas',
      color: 'bg-accent-light/30',
      iconColor: 'text-accent',
      stats: 'Economia de 30%',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      ),
      title: 'Compartilhamento',
      description: 'Compartilhe com parceiros para planejar juntos',
      color: 'bg-primary/10',
      iconColor: 'text-primary',
      stats: 'Colaboração real-time',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Cronograma',
      description: 'Organize tarefas e marcos importantes do casamento',
      color: 'bg-secondary/15',
      iconColor: 'text-accent',
      stats: '12 meses planejamento',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      title: 'Fornecedores',
      description: 'Gerencie contatos, orçamentos e contratos',
      color: 'bg-accent/20',
      iconColor: 'text-accent-dark',
      stats: 'Rede de parceiros',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: 'Documentos',
      description: 'Organize contratos e documentos importantes',
      color: 'bg-accent/20',
      iconColor: 'text-accent-dark',
      stats: 'Armazenamento seguro',
    },
  ];

  return (
    <div ref={ref} className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-navy mb-4">
          Tudo que você precisa para seu{' '}
          <span className="font-script text-primary text-3xl md:text-4xl lg:text-5xl block mt-1">
            casamento perfeito
          </span>
        </h2>
        <p className="text-base md:text-lg text-navy-light max-w-2xl mx-auto leading-relaxed">
          Ferramentas completas para organizar cada detalhe do seu grande dia
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20 transform hover:-translate-y-1"
          >
            {/* Background decoration */}
            <div
              className={`absolute top-0 right-0 w-14 h-14 ${feature.color} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
            ></div>

            <div className="relative z-10">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 ${feature.color} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className={feature.iconColor}>{feature.icon}</div>
              </div>

              <h3 className="text-base md:text-lg font-display font-bold text-navy mb-2 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-navy-light text-sm leading-relaxed mb-3">{feature.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {feature.stats}
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Bottom CTA */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg md:text-xl font-display font-bold text-navy mb-2">
            Pronto para começar?
          </h3>
          <p className="text-sm text-navy-light mb-4">
            Junte-se a milhares de casais que já usam o WedPlan
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-5 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 text-sm">
              Começar Gratuitamente
            </button>
            <button className="px-5 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm">
              Ver Demonstração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
