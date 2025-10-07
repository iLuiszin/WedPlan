'use server';

import { GuestModel } from '@/models/guest';
import { connectToDatabase } from '@/lib/db';
import type { ActionResponse } from '@/types/action-response';

export async function exportGuestsAsCSVAction(
  projectId: string
): Promise<ActionResponse<string>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guests = await GuestModel.find({ projectId }).sort({ lastName: 1, firstName: 1 });

    let csv = '\uFEFF';
    csv += 'Nome,Sobrenome,Categoria,Funcao,Parceiro\n';

    for (const guest of guests) {
      const partner = guest.partnerId
        //@ts-expect-error - Mongoose typing complexity
        ? await GuestModel.findById(guest.partnerId).select('firstName lastName')
        : null;
      const partnerName = partner ? `${partner.firstName} ${partner.lastName}` : '';

      csv += `"${guest.firstName}","${guest.lastName}","${guest.category}","${guest.role}","${partnerName}"\n`;
    }

    return { success: true, data: csv };
  } catch (error) {
    console.error('Error exporting guests:', error);
    return { success: false, error: 'Failed to export guests', code: 'EXPORT_ERROR' };
  }
}
