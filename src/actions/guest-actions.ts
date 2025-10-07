'use server';

import { revalidatePath } from 'next/cache';
import type { Document } from 'mongoose';
import { GuestModel } from '@/models/guest';
import { createGuestSchema, updateGuestSchema } from '@/schemas/guest-schema';
import { connectToDatabase } from '@/lib/db';
import type { ActionResponse } from '@/types/action-response';
import type { IGuest } from '@/models/guest';

function serializeGuest(guest: Document & IGuest): IGuest {
  return JSON.parse(JSON.stringify(guest.toObject()));
}

export async function createGuestAction(input: unknown): Promise<ActionResponse<IGuest>> {
  const parsed = createGuestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guest = await GuestModel.create(parsed.data);
    revalidatePath('/guests');
    return { success: true, data: serializeGuest(guest) };
  } catch (error) {
    console.error('Error creating guest:', error);
    return { success: false, error: 'Failed to create guest', code: 'DB_ERROR' };
  }
}

export async function updateGuestAction(input: unknown): Promise<ActionResponse<IGuest>> {
  const parsed = updateGuestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
  }

  try {
    await connectToDatabase();
    const { _id, ...updates } = parsed.data;
    //@ts-expect-error - Mongoose typing complexity
    const guest = await GuestModel.findByIdAndUpdate(_id, updates, { new: true });
    if (!guest) {
      return { success: false, error: 'Guest not found', code: 'NOT_FOUND' };
    }
    revalidatePath('/guests');
    return { success: true, data: serializeGuest(guest) };
  } catch (error) {
    console.error('Error updating guest:', error);
    return { success: false, error: 'Failed to update guest', code: 'DB_ERROR' };
  }
}

export async function deleteGuestAction(id: string): Promise<ActionResponse<void>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guest = await GuestModel.findById(id);
    if (!guest) {
      return { success: false, error: 'Guest not found', code: 'NOT_FOUND' };
    }

    // Unlink partner if exists
    if (guest.partnerId) {
      //@ts-expect-error - Mongoose typing complexity
      await GuestModel.findByIdAndUpdate(guest.partnerId, { partnerId: null });
    }

    //@ts-expect-error - Mongoose typing complexity
    await GuestModel.findByIdAndDelete(id);
    revalidatePath('/guests');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting guest:', error);
    return { success: false, error: 'Failed to delete guest', code: 'DB_ERROR' };
  }
}

export async function linkPartnersAction(
  aId: string,
  bId: string
): Promise<ActionResponse<void>> {
  try {
    await connectToDatabase();

    //@ts-expect-error - Mongoose typing complexity
    const guestA = await GuestModel.findById(aId);
    //@ts-expect-error - Mongoose typing complexity
    const guestB = await GuestModel.findById(bId);

    if (!guestA || !guestB) {
      return { success: false, error: 'Guest not found', code: 'NOT_FOUND' };
    }

    if (aId === bId) {
      return { success: false, error: 'Cannot link guest to self', code: 'INVALID_LINK' };
    }

    // Unlink previous partners
    if (guestA.partnerId && guestA.partnerId.toString() !== bId) {
      //@ts-expect-error - Mongoose typing complexity
      await GuestModel.findByIdAndUpdate(guestA.partnerId, { partnerId: null });
    }
    if (guestB.partnerId && guestB.partnerId.toString() !== aId) {
      //@ts-expect-error - Mongoose typing complexity
      await GuestModel.findByIdAndUpdate(guestB.partnerId, { partnerId: null });
    }

    // Link bidirectionally
    await Promise.all([
      //@ts-expect-error - Mongoose typing complexity
      GuestModel.findByIdAndUpdate(aId, { partnerId: bId }),
      //@ts-expect-error - Mongoose typing complexity
      GuestModel.findByIdAndUpdate(bId, { partnerId: aId }),
    ]);

    revalidatePath('/guests');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error linking partners:', error);
    return { success: false, error: 'Failed to link partners', code: 'DB_ERROR' };
  }
}

export async function unlinkPartnerAction(id: string): Promise<ActionResponse<void>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guest = await GuestModel.findById(id);
    if (!guest) {
      return { success: false, error: 'Guest not found', code: 'NOT_FOUND' };
    }

    if (guest.partnerId) {
      //@ts-expect-error - Mongoose typing complexity
      await GuestModel.findByIdAndUpdate(guest.partnerId, { partnerId: null });
    }

    //@ts-expect-error - Mongoose typing complexity
    await GuestModel.findByIdAndUpdate(id, { partnerId: null });
    revalidatePath('/guests');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error unlinking partner:', error);
    return { success: false, error: 'Failed to unlink partner', code: 'DB_ERROR' };
  }
}

export async function getGuestsAction(projectId: string): Promise<ActionResponse<IGuest[]>> {
  try {
    await connectToDatabase();
    //@ts-expect-error - Mongoose typing complexity
    const guests = await GuestModel.find({ projectId }).sort({ lastName: 1, firstName: 1 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, data: guests.map((g: any) => serializeGuest(g)) };
  } catch (error) {
    console.error('Error fetching guests:', error);
    return { success: false, error: 'Failed to fetch guests', code: 'DB_ERROR' };
  }
}
