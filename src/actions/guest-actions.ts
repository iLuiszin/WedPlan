'use server';

import { revalidatePath } from 'next/cache';
import { createGuestSchema, updateGuestSchema } from '@/schemas/guest-schema';
import type { ActionResponse } from '@/types/action-response';
import type { IGuest } from '@/models/guest';
import { GuestRepository } from '@/repositories/guest-repository';
import { GuestService } from '@/services/guest-service';
import { AppError, ErrorCode } from '@/types/error-codes';
import { logger } from '@/lib/logger';
import type { SerializedDocument } from '@/types/mongoose-helpers';

const guestRepository = new GuestRepository();
const guestService = new GuestService(guestRepository);

export async function createGuestAction(
  input: unknown
): Promise<ActionResponse<SerializedDocument<IGuest>>> {
  const parsed = createGuestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const guest = await guestRepository.create(parsed.data);
    revalidatePath('/guests');
    return { success: true, data: guest };
  } catch (error) {
    logger.error('Failed to create guest', error as Error, { input: parsed.data });
    return { success: false, error: 'Failed to create guest', code: ErrorCode.DB_ERROR };
  }
}

export async function updateGuestAction(
  input: unknown
): Promise<ActionResponse<SerializedDocument<IGuest>>> {
  const parsed = updateGuestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR };
  }

  try {
    const { _id, ...updates } = parsed.data;
    const guest = await guestRepository.update(_id, updates);

    if (!guest) {
      return { success: false, error: 'Guest not found', code: ErrorCode.NOT_FOUND };
    }

    revalidatePath('/guests');
    return { success: true, data: guest };
  } catch (error) {
    logger.error('Failed to update guest', error as Error, { input: parsed.data });
    return { success: false, error: 'Failed to update guest', code: ErrorCode.DB_ERROR };
  }
}

export async function deleteGuestAction(id: string): Promise<ActionResponse<void>> {
  try {
    const guest = await guestRepository.findById(id);

    if (!guest) {
      return { success: false, error: 'Guest not found', code: ErrorCode.NOT_FOUND };
    }

    // Unlink partner if exists
    if (guest.partnerId) {
      await guestRepository.updatePartnerId(guest.partnerId.toString(), null);
    }

    await guestRepository.delete(id);
    revalidatePath('/guests');
    return { success: true, data: undefined };
  } catch (error) {
    logger.error('Failed to delete guest', error as Error, { guestId: id });
    return { success: false, error: 'Failed to delete guest', code: ErrorCode.DB_ERROR };
  }
}

export async function linkPartnersAction(aId: string, bId: string): Promise<ActionResponse<void>> {
  try {
    await guestService.linkPartners(aId, bId);
    revalidatePath('/guests');
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }

    logger.error('Failed to link partners', error as Error, { aId, bId });
    return { success: false, error: 'Failed to link partners', code: ErrorCode.DB_ERROR };
  }
}

export async function unlinkPartnerAction(id: string): Promise<ActionResponse<void>> {
  try {
    await guestService.unlinkPartner(id);
    revalidatePath('/guests');
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }

    logger.error('Failed to unlink partner', error as Error, { guestId: id });
    return { success: false, error: 'Failed to unlink partner', code: ErrorCode.DB_ERROR };
  }
}

export async function getGuestsAction(
  projectId: string
): Promise<ActionResponse<SerializedDocument<IGuest>[]>> {
  try {
    const guests = await guestRepository.findByProject(projectId);
    return { success: true, data: guests };
  } catch (error) {
    logger.error('Failed to fetch guests', error as Error, { projectId });
    return { success: false, error: 'Failed to fetch guests', code: ErrorCode.DB_ERROR };
  }
}
