'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Erro ao carregar orçamentos</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
      >
        Tentar novamente
      </button>
    </div>
  );
}
