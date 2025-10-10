export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ana & Carlos',
      location: 'São Paulo, SP',
      text: 'O WedPlan transformou nosso planejamento! Conseguimos organizar tudo sem estresse e ainda economizamos 25% do orçamento inicial.',
      rating: 5,
      highlight: 'Economizaram 25%',
    },
    {
      name: 'Mariana & João',
      location: 'Rio de Janeiro, RJ',
      text: 'A lista de convidados ficou perfeita! Todos confirmaram presença pelo app e não tivemos nenhuma confusão no grande dia.',
      rating: 5,
      highlight: '100% confirmações',
    },
    {
      name: 'Fernanda & Pedro',
      location: 'Belo Horizonte, MG',
      text: 'Compartilhar o planejamento com nossa família foi incrível. Todos puderam ajudar e acompanhar cada detalhe em tempo real.',
      rating: 5,
      highlight: 'Família integrada',
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-navy mb-4">
          Casais que já realizaram seus{' '}
          <span className="font-script text-primary text-3xl md:text-4xl lg:text-5xl block mt-1">
            sonhos
          </span>
        </h2>
        <p className="text-base md:text-lg text-navy-light max-w-2xl mx-auto leading-relaxed">
          Veja o que nossos usuários dizem sobre sua experiência
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20 transform hover:-translate-y-1"
          >
            {/* Rating */}
            <div className="flex items-center mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Testimonial text */}
            <p className="text-navy-light leading-relaxed mb-4 italic text-sm">
              "{testimonial.text}"
            </p>

            {/* User info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                  {testimonial.name.split(' ')[0]?.[0]}
                  {testimonial.name.split(' ')[2]?.[0] ?? ''}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-navy text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-navy-light">{testimonial.location}</p>
                </div>
              </div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                {testimonial.highlight}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Compact stats section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-display font-bold text-navy mb-1">
              10,000+
            </div>
            <p className="text-navy-light font-semibold text-xs">Casamentos</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-display font-bold text-navy mb-1">98%</div>
            <p className="text-navy-light font-semibold text-xs">Satisfação</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-display font-bold text-navy mb-1">30%</div>
            <p className="text-navy-light font-semibold text-xs">Economia</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-display font-bold text-navy mb-1">24/7</div>
            <p className="text-navy-light font-semibold text-xs">Suporte</p>
          </div>
        </div>
      </div>
    </div>
  );
}
