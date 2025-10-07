'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function ShareableUrl({ projectId }: { projectId: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/project/${projectId}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar URL');
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Link Compartilhável</h3>
      <p className="text-sm text-gray-600 mb-4">
        Compartilhe este link com seu parceiro, família e amigos para colaborarem no planejamento
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleCopy}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}
