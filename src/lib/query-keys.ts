export const queryKeys = {
  guests: {
    all: () => ['guests'] as const,
    byProject: (projectId: string) => ['guests', projectId] as const,
  },
  budgets: {
    all: () => ['budgets'] as const,
    byProject: (projectId: string) => ['budgets', projectId] as const,
  },
  projects: {
    all: () => ['projects'] as const,
    byId: (id: string) => ['projects', id] as const,
  },
} as const;
