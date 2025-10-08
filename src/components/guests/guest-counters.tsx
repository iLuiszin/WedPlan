'use client';

import { useState } from 'react';
import { useGuests } from '@/hooks/use-guests';
import { useProjectContext } from '@/components/projects/project-context';
import { useModal } from '@/contexts/modal-context';
import { GUEST_CATEGORIES, GUEST_ROLES } from '@/lib/constants';
import { exportGuestsAsXLSXAction } from '@/actions/export-actions';

export function GuestCounters() {
  const { projectId } = useProjectContext();
  const { data: guests } = useGuests(projectId);
  const [isExporting, setIsExporting] = useState(false);
  const { showAlert } = useModal();

  const handleExportXLSX = async () => {
    setIsExporting(true);
    try {
      const result = await exportGuestsAsXLSXAction(projectId);
      if (result.success) {
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let index = 0; index < byteCharacters.length; index += 1) {
          byteNumbers[index] = byteCharacters.charCodeAt(index);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `convidados-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        await showAlert({ message: `Erro ao exportar: ${result.error}` });
      }
    } catch (error) {
      console.error('Export error:', error);
      await showAlert({ message: 'Erro ao exportar convidados' });
    } finally {
      setIsExporting(false);
    }
  };

  if (!guests) {
    return null;
  }

  const totalGuests = guests.length;
  const totalGroom = guests.filter((g) => g.category === GUEST_CATEGORIES.GROOM).length;
  const totalBride = guests.filter((g) => g.category === GUEST_CATEGORIES.BRIDE).length;
  const totalBoth = guests.filter((g) => g.category === GUEST_CATEGORIES.BOTH).length;
  const totalGroomsmen = guests.filter((g) => g.role === GUEST_ROLES.GROOMSMAN).length;
  const totalBridesmaids = guests.filter((g) => g.role === GUEST_ROLES.BRIDESMAID).length;

  const coupleIds = new Set<string>();
  guests.forEach((guest) => {
    if (guest.partnerId) {
      const pair = [guest._id.toString(), guest.partnerId.toString()].sort().join('-');
      coupleIds.add(pair);
    }
  });
  const totalCouples = coupleIds.size;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Estatísticas</h3>
        <button
          onClick={handleExportXLSX}
          disabled={isExporting}
          className="px-3 py-1.5 text-sm border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition disabled:opacity-50"
          title="Exportar lista de convidados"
        >
          {isExporting ? 'Exportando...' : '📤 Exportar Planilha'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="text-center p-3 bg-gradient-to-br from-primary to-secondary rounded-lg text-white">
          <div className="text-2xl font-bold">{totalGuests}</div>
          <div className="text-xs font-medium">Total</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-500">{totalGroom}</div>
          <div className="text-xs text-gray-600">Noivo</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-pink-500">{totalBride}</div>
          <div className="text-xs text-gray-600">Noiva</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-500">{totalBoth}</div>
          <div className="text-xs text-gray-600">Ambos</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalGroomsmen}</div>
          <div className="text-xs text-gray-600">Padrinhos</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-pink-600">{totalBridesmaids}</div>
          <div className="text-xs text-gray-600">Madrinhas</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{totalCouples}</div>
          <div className="text-xs text-gray-600">Casais</div>
        </div>
      </div>
    </div>
  );
}
