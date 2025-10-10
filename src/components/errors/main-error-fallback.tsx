'use client';

import { useEffect } from 'react';

interface MainErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function MainErrorFallback({ error, resetErrorBoundary }: MainErrorFallbackProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Ops! Algo deu errado
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-gray-700 font-medium mb-2">
              Detalhes do erro (modo desenvolvimento)
            </summary>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40 text-red-600">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <button
          onClick={resetErrorBoundary}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Tentar novamente
        </button>

        <button
          onClick={() => window.location.href = '/'}
          className="w-full mt-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
}
