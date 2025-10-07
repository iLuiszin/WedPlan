# WedPlan

Aplicacao web para organizar casamentos de ponta a ponta. O WedPlan permite criar varios projetos de casamento, controlar convidados, acompanhar orcamentos e compartilhar informacoes com o time envolvido na celebracao.

## Visao Geral

- Painel inicial com criacao rapida de novos casamentos e acesso via link compartilhavel.
- Projetos isolados: cada casamento tem convidados, orcamentos e configuracoes proprias.
- Base em Next.js 15 com Server Actions para garantir fluxo reativo e seguro.
- Interface responsiva desenvolvida com Tailwind CSS e foco em experiência mobile-first.

## Funcionalidades Principais

### Projetos
- Criacao de casamentos ilimitados com dados do casal e data prevista.
- Compartilhamento do projeto por URL dedicada.
- Revalidacao automatica de paginas sempre que os dados mudam.

### Convidados
- CRUD completo com validacao usando Zod.
- Vinculo de parceiros e classificacao por lado (noiva, noivo ou ambos).
- Definicao de papeis (convidado, madrinha, padrinho) e contadores em tempo real.
- Busca, filtros e edicao inline otimizados para uso em dispositivos pequenos.

### Orcamentos
- Controle de fornecedores e categorias de gasto por projeto.
- Lancamento de itens com calculo automatico de total e exibicao do valor consolidado.
- Ordenacao por nome, valor ou data e suporte a filtros rapidos.

### Experiencia do Usuario
- Feedback imediato com toasts e estados de carregamento.
- Hooks personalizados para centralizar logica de mutacoes com React Query.
- Layout responsivo que se adapta a tablets e smartphones em modo retrato ou paisagem.

## Como Funciona

1. **Criar projeto** – informe os dados do casal e (opcionalmente) a data do casamento.
2. **Convidar colaboradores** – compartilhe o link do projeto com quem vai ajudar na organizacao.
3. **Gerenciar convidados** – cadastre pessoas, categorize, defina papeis e vincule casais.
4. **Planejar orcamentos** – registre fornecedores, itens e acompanhe os custos consolidados.
5. **Manter atualizado** – edite dados diretamente nos cards; as mudancas sao refletidas em tempo real.

## Stack Tecnica

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Linguagem**: TypeScript em modo estrito
- **Banco de dados**: MongoDB com Mongoose
- **Data fetching**: TanStack Query 5 com cache e invalidacao inteligente
- **Forms e validacao**: React Hook Form + Zod
- **Estilos**: Tailwind CSS, componentes customizados seguindo padroes shadcn/ui
- **Feedback visual**: Biblioteca Sonner para notificacoes

## Guia Rápido

### Pre-requisitos

- Node.js 20 ou superior
- Instancia MongoDB (Atlas ou local)

### Instalacao

```bash
git clone https://github.com/iLuiszin/WedPlan.git
cd WedPlan
npm install
cp .env.example .env
```

Configure o arquivo `.env` adicionando a string de conexao do MongoDB:

```env
MONGODB_URI=sua_string_de_conexao
```

Inicie o projeto em modo desenvolvimento:

```bash
npm run dev
```

Acesse a aplicacao em `http://localhost:3000`.

## Scripts Disponiveis

| Script               | Descricao                                 |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Inicia o servidor de desenvolvimento      |
| `npm run build`      | Gera build de producao                    |
| `npm start`          | Sobe o servidor em modo producao          |
| `npm run lint`       | Executa ESLint                            |
| `npm run type-check` | Roda o verificador de types do TypeScript |
| `npm test`           | Executa testes unitarios e de integracao  |
| `npm run test:e2e`   | Roda testes end-to-end                    |

## Variaveis de Ambiente

| Variavel          | Descricao                                       | Obrigatorio |
| ----------------- | ----------------------------------------------- | ----------- |
| `MONGODB_URI`     | String de conexao com o MongoDB                 | Sim         |
| `NODE_ENV`        | Define ambiente (`development` ou `production`) | Nao         |
| `FRONTEND_ORIGIN` | URL usada para configurar CORS                  | Nao         |
| `PORT`            | Porta utilizada pelo servidor                   | Nao         |

Consulte `.env.example` para ver o modelo completo.

## Estrutura do Projeto

```
src/
  app/
    project/[projectId]/
      guests/          # Pagina de convidados
      budgets/         # Pagina de orcamentos
      layout.tsx       # Provider e protecao do projeto
      page.tsx         # Painel principal do projeto
    page.tsx           # Landing page
    not-found.tsx      # Tratamento de rotas invalidas
  actions/             # Server Actions centralizadas
  components/          # Componentes reutilizaveis
    guests/            # Form, lista e cards de convidados
    budgets/           # Componentes relacionados a orcamentos
    projects/          # Criacao e contexto de projetos
  hooks/               # Hooks personalizados
  lib/                 # Conexoes e helpers (ex: MongoDB)
  models/              # Modelos Mongoose
  schemas/             # Validacoes Zod
  types/               # Tipos compartilhados
```

## Observacoes

- O projeto prioriza tipagem fim a fim, evitando uso de `any` e garantindo validacao no cliente e servidor.
- A interface foi pensada para times que compartilham tarefas; use o link de compartilhamento para convidar parceiros e fornecedores.
- Para deploy, basta apontar sua plataforma favorita de Node.js (Vercel, Railway, Render etc.) para o comando `npm run build` seguido de `npm start`, garantindo que `MONGODB_URI` esteja configurada.

## Licenca

Distribuido sob licenca MIT. Sinta-se livre para adaptar o WedPlan ao casamento da sua vida (ou ao de seus clientes).
