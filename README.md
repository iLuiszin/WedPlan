# WedPlan

Aplicação moderna de planejamento de casamento construída com Next.js 15, TypeScript e MongoDB. Gerencie múltiplos projetos de casamento, acompanhe convidados e organize orçamentos em um só lugar.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iLuiszin/wedding-organizer)

## Funcionalidades

### 🎯 Gerenciamento Multi-Projetos
- Crie e gerencie múltiplos projetos de casamento
- URLs compartilháveis para colaboração fácil
- Isolamento completo de dados entre projetos
- Painel do projeto com informações do casal e data do casamento

### 👥 Gerenciamento de Convidados
- Operações CRUD completas para convidados
- Vinculação de parceiros com relacionamentos bidirecionais
- Atribuição de categoria: Lado do noivo, lado da noiva, ou ambos
- Designação de função: Convidado, padrinho ou madrinha
- Estatísticas em tempo real (total de convidados, casais, padrinhos)
- Edição inline e categorias clicáveis
- Busca e filtro por nome ou categoria
- Exportação para CSV (compatível com Excel UTF-8 BOM)
- Importação/Exportação via JSON com metadados

### 💰 Gerenciamento de Orçamentos
- Acompanhe orçamentos de múltiplos locais
- Gerenciamento inline de itens por orçamento
- Cálculos automáticos de totais
- Total geral entre todos os orçamentos
- Ordenação por preço, nome ou data
- Busca e filtro por nome do local
- Formatação de moeda em Real Brasileiro (R$)

### ✨ Experiência do Usuário
- Design moderno e responsivo com Tailwind CSS
- Atualizações em tempo real com UI otimista
- Notificações toast para todas as operações
- Error boundaries com funcionalidade de retry
- Estados de carregamento e transições suaves
- Interface amigável para dispositivos móveis

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Database:** MongoDB with Mongoose
- **State Management:** TanStack Query (React Query v5)
- **Validation:** Zod
- **Forms:** React Hook Form
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with shadcn/ui patterns
- **Notifications:** Sonner

## Começando

### Pré-requisitos

- Node.js 20 ou superior
- Conta MongoDB Atlas ou instância local do MongoDB

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/iLuiszin/wedding-organizer.git
cd wedding-organizer
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua string de conexão do MongoDB:
```env
MONGODB_URI=sua_string_de_conexao_mongodb
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run unit and integration tests |
| `npm run test:e2e` | Run end-to-end tests |

## Estrutura do Projeto

```
wedding-organizer/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── project/[projectId]/  # Dynamic project routes
│   │   │   ├── guests/       # Guest management page
│   │   │   ├── budgets/      # Budget management page
│   │   │   └── page.tsx      # Project dashboard
│   │   └── page.tsx          # Landing page
│   ├── actions/              # Server Actions
│   ├── components/           # React components
│   │   ├── budgets/         # Budget components
│   │   ├── guests/          # Guest components
│   │   ├── layout/          # Header, navigation
│   │   ├── projects/        # Project components
│   │   └── providers/       # Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and database
│   ├── models/              # Mongoose models
│   ├── schemas/             # Zod validation schemas
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | No |
| `PORT` | Custom port (defaults to 3000) | No |

See `.env.example` for a complete template.

## Deployment

### Deploy to Vercel

1. Click the "Deploy with Vercel" button above, or:

2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Vercel (recommended)
- Netlify
- Railway
- Render
- AWS Amplify

Ensure you set the `MONGODB_URI` environment variable in your deployment platform.

## Architecture Highlights

- **Type Safety:** End-to-end TypeScript with strict mode enabled
- **Server Actions:** Type-safe RPC-style API with `'use server'` directive
- **React Query:** Automatic caching, revalidation, and optimistic updates
- **Validation:** Runtime validation with Zod on both client and server
- **Error Handling:** Comprehensive error boundaries with retry functionality
- **Security:** CSP headers, HSTS, XSS protection, input sanitization
- **Performance:** React Suspense, code splitting, optimized bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for your own wedding planning needs.

## Acknowledgments

Built with modern web technologies and best practices for type safety, performance, and user experience.

---

**Made with ❤️ for couples planning their perfect day**
