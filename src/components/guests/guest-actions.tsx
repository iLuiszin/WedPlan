'use client';

import { useState } from 'react';
import {
  exportGuestsAsCSVAction,
  exportGuestsAsJSONAction,
  importGuestsFromJSONAction,
} from '@/actions/export-actions';
import { useProjectContext } from '@/components/projects/project-context';
import { useQueryClient } from '@tanstack/react-query';

export function GuestActions() {
  const { projectId } = useProjectContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const result = await exportGuestsAsCSVAction(projectId);
      if (result.success) {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `convidados-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(`Erro ao exportar: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Erro ao exportar convidados');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const result = await exportGuestsAsJSONAction(projectId);
      if (result.success) {
        const blob = new Blob([result.data], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `convidados-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(`Erro ao exportar: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Erro ao exportar convidados');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const confirmMsg = `Este arquivo contém ${parsed.guests?.length || 0} convidado(s).\n\nDeseja substituir a lista atual?`;
      if (!confirm(confirmMsg)) {
        event.target.value = '';
        setIsImporting(false);
        return;
      }

      const result = await importGuestsFromJSONAction(projectId, text);
      if (result.success) {
        alert(`${result.data} convidados importados com sucesso!`);
        void queryClient.invalidateQueries({ queryKey: ['guests'] });
      } else {
        alert(`Erro ao importar: ${result.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Erro ao importar: arquivo inválido');
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Ações</h3>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition disabled:opacity-50"
        >
          {isExporting ? 'Exportando...' : 'Exportar Excel (CSV)'}
        </button>

        <button
          onClick={handleExportJSON}
          disabled={isExporting}
          className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition disabled:opacity-50"
        >
          {isExporting ? 'Exportando...' : 'Exportar JSON'}
        </button>

        <label className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition cursor-pointer">
          {isImporting ? 'Importando...' : 'Importar JSON'}
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            disabled={isImporting}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
