'use server';

import { buildGuestsWorkbook } from '@/lib/export-guests';
import { GuestRepository } from '@/repositories/guest-repository';
import { withAction } from '@/lib/action-wrapper';

const guestRepository = new GuestRepository();

export const exportGuestsAsXLSXAction = withAction(
  async (projectId: string) => {
    const ExcelJS = await import('exceljs');
    const guests = await guestRepository.findByProject(projectId);
    const workbookData = await buildGuestsWorkbook(guests, ExcelJS);
    const base64 = Buffer.from(workbookData).toString('base64');

    return base64;
  },
  {
    operationName: 'Export guests as XLSX',
  }
);
