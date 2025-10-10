'use server';

import { buildGuestsWorkbook } from './utils/export';
import { withAction } from '@/lib/action-wrapper';
import { findGuestsByProject } from './api/get-guests';

export const exportGuestsAsXLSXAction = withAction(
  async (projectId: string) => {
    const ExcelJS = await import('exceljs');
    const guests = await findGuestsByProject(projectId);
    const workbookData = await buildGuestsWorkbook(guests, ExcelJS);
    const base64 = Buffer.from(workbookData).toString('base64');

    return base64;
  },
  {
    operationName: 'Export guests as XLSX',
  }
);
