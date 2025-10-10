'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface RecentProject {
  _id: string;
  slug?: string;
  brideFirstName?: string;
  groomFirstName?: string;
  lastAccessed: string;
}

interface SearchResultProject {
  _id: string;
  slug: string;
  brideFirstName: string;
  groomFirstName: string;
}

interface SearchProjectsProps {
  variant?: 'hero' | 'default';
}

const STORAGE_KEY = '@wedplan:recent-projects';

export function SearchProjects({ variant = 'default' }: SearchProjectsProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultProject[]>([]);
  const [loading, setLoading] = useState(false);

  const recents = useMemo<RecentProject[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as RecentProject[]) : [];
    } catch {
      return [];
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/search?q=${encodeURIComponent(query)}`);
      const data = (await res.json()) as SearchResultProject[];
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className="w-full">
      {/* Search Form */}
      <form onSubmit={onSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque pelo nome dos noivos ou código do projeto"
          className={`flex-1 px-4 py-3 rounded-lg transition-all ${
            isHero
              ? 'bg-white border border-gray-200 text-navy placeholder:text-navy-light/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
              : 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-32 sm:w-auto self-center sm:self-auto px-6 py-3 rounded-lg font-medium transition-all ${
            isHero
              ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
              : 'bg-primary text-white hover:bg-primary-dark'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Recent Projects */}
      {recents.length > 0 && query.trim() === '' && (
        <div className="mb-6">
          <h3
            className={`font-semibold mb-3 ${
              isHero ? 'text-navy text-sm uppercase tracking-wide' : 'text-gray-700'
            }`}
          >
            Projetos Recentes
          </h3>
          <div className="grid gap-2">
            {recents.slice(0, 5).map((p) => (
              <button
                key={p._id}
                onClick={() => router.push(`/project/${p._id}`)}
                className={`text-left p-4 rounded-lg transition-all ${
                  isHero
                    ? 'bg-white border border-gray-200 hover:border-primary hover:shadow-md'
                    : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className={`font-medium mb-1 ${isHero ? 'text-navy' : 'text-gray-900'}`}>
                  {p.brideFirstName && p.groomFirstName
                    ? `${p.brideFirstName} & ${p.groomFirstName}`
                    : p.brideFirstName || p.groomFirstName || 'Projeto'}
                </div>
                <div className={`text-xs ${isHero ? 'text-navy-light' : 'text-gray-500'}`}>
                  {p.slug ?? `ID: ${p._id.slice(0, 8)}...`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className={`text-sm text-center py-8 ${isHero ? 'text-navy-light' : 'text-gray-500'}`}>
          <div className="animate-pulse">Buscando projetos...</div>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h3
            className={`font-semibold mb-3 ${
              isHero ? 'text-navy text-sm uppercase tracking-wide' : 'text-gray-700'
            }`}
          >
            Resultados da Busca
          </h3>
          <div className="grid gap-2">
            {results.map((p) => (
              <button
                key={p._id}
                onClick={() => router.push(`/project/${p._id}`)}
                className={`text-left p-4 rounded-lg transition-all ${
                  isHero
                    ? 'bg-white border border-gray-200 hover:border-primary hover:shadow-md'
                    : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className={`font-medium mb-1 ${isHero ? 'text-navy' : 'text-gray-900'}`}>
                  {p.brideFirstName} & {p.groomFirstName}
                </div>
                <div className={`text-xs ${isHero ? 'text-navy-light' : 'text-gray-500'}`}>
                  {p.slug}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : query.trim() && !loading ? (
        <div className={`text-center py-8 ${isHero ? 'text-navy-light' : 'text-gray-500'}`}>
          <p className="text-sm">Nenhum projeto encontrado</p>
          <p className="text-xs mt-1">Tente buscar com outros termos</p>
        </div>
      ) : null}
    </div>
  );
}
