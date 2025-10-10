interface PricingSectionProps {
  onGetStarted: () => void;
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        'Até 50 convidados',
        'Controle básico de orçamento',
        'Lista de tarefas',
        'Suporte por email',
      ],
      buttonText: 'Começar Grátis',
      popular: false,
    },
    {
      name: 'Premium',
      price: 'R$ 29',
      period: '/mês',
      description: 'Para casamentos completos',
      features: [
        'Convidados ilimitados',
        'Controle avançado de orçamento',
        'Cronograma detalhado',
        'Compartilhamento',
        'Relatórios personalizados',
        'Suporte prioritário',
      ],
      buttonText: 'Teste Grátis',
      popular: true,
    },
    {
      name: 'Empresarial',
      price: 'R$ 99',
      period: '/mês',
      description: 'Para wedding planners',
      features: [
        'Múltiplos casamentos',
        'Gestão de equipe',
        'Marca personalizada',
        'API integração',
        'Suporte dedicado',
      ],
      buttonText: 'Falar com Vendas',
      popular: false,
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-navy mb-4">
          Escolha o plano ideal para seu{' '}
          <span className="font-script text-primary text-3xl md:text-4xl lg:text-5xl block mt-1">
            casamento
          </span>
        </h2>
        <p className="text-base md:text-lg text-navy-light max-w-2xl mx-auto leading-relaxed">
          Comece gratuitamente e evolua conforme suas necessidades
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-2xl p-6 shadow-md transition-all duration-300 border-2 transform hover:-translate-y-1 ${
              plan.popular
                ? 'border-primary shadow-lg scale-105'
                : 'border-gray-100 hover:border-primary/20 hover:shadow-lg'
            }`}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  Mais Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-display font-bold text-navy mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-3xl md:text-4xl font-display font-bold text-navy">
                  {plan.price}
                </span>
                <span className="text-navy-light ml-1 text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-navy-light">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-navy-light">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onGetStarted}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                plan.popular
                  ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transform hover:scale-105'
                  : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="text-center">
        <p className="text-navy-light mb-6 text-sm">Mais de 10.000 casais confiam no WedPlan</p>
        <div className="flex flex-wrap justify-center items-center gap-6 text-navy-light text-sm">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Pagamento Seguro
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Suporte 24/7
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            30 Dias Grátis
          </span>
        </div>
      </div>
    </div>
  );
}
