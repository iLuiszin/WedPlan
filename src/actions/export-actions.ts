'use server';

import type { Document } from 'mongoose';
import { GuestModel } from '@/models/guest';
import type { IGuest } from '@/models/guest';
import { connectToDatabase } from '@/lib/db';
import type { ActionResponse } from '@/types/action-response';

export async function exportGuestsAsCSVAction(
  projectId: string
): Promise<ActionResponse<string>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guests = await GuestModel.find({ projectId }).sort({ lastName: 1, firstName: 1 });

    let csv = '\uFEFF'; // UTF-8 BOM
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

export async function exportGuestsAsJSONAction(
  projectId: string
): Promise<ActionResponse<string>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guests = await GuestModel.find({ projectId }).sort({ lastName: 1, firstName: 1 });

    const data = {
      guests: guests.map((g: Document & IGuest) => g.toObject()),
      exportedAt: new Date().toISOString(),
      projectId,
    };

    return { success: true, data: JSON.stringify(data, null, 2) };
  } catch (error) {
    console.error('Error exporting guests:', error);
    return { success: false, error: 'Failed to export guests', code: 'EXPORT_ERROR' };
  }
}

export async function importGuestsFromJSONAction(
  projectId: string,
  jsonData: string
): Promise<ActionResponse<number>> {
  try {
    const parsed = JSON.parse(jsonData);
    if (!Array.isArray(parsed.guests)) {
      return { success: false, error: 'Invalid JSON format', code: 'INVALID_FORMAT' };
    }

    await connectToDatabase();

    // Clear existing guests
    await GuestModel.deleteMany({ projectId });

    // Import guests (note: partner IDs will need remapping in a more complete implementation)
    const guests = parsed.guests.map((g: Partial<IGuest>) => ({
      projectId,
      firstName: g.firstName || '',
      lastName: g.lastName || '',
      category: g.category || 'both',
      role: g.role || 'guest',
      partnerId: null, // Skip partner linking on import for simplicity
    }));

    await GuestModel.insertMany(guests);

    return { success: true, data: guests.length };
  } catch (error) {
    console.error('Error importing guests:', error);
    return { success: false, error: 'Failed to import guests', code: 'IMPORT_ERROR' };
  }
}
