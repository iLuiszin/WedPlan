'use server';

import { GuestModel } from '@/models/guest';
import { connectToDatabase } from '@/lib/db';
import type { ActionResponse } from '@/types/action-response';
import { buildGuestsWorkbook } from '@/lib/export-guests';

export async function exportGuestsAsXLSXAction(
  projectId: string,
): Promise<ActionResponse<string>> {
  try {
    await connectToDatabase();

    const ExcelJS = (await import('exceljs')).default;

    const guests = await GuestModel.find({ projectId }).sort({ lastName: 1, firstName: 1 });

    const workbookData = await buildGuestsWorkbook(guests, ExcelJS);

    const base64 = Buffer.from(workbookData).toString('base64');

    return { success: true, data: base64 };
  } catch (error) {
    console.error('Error exporting guests:', error);
    return { success: false, error: 'Failed to export guests', code: 'EXPORT_ERROR' };
  }
}
