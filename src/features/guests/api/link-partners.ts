import { AppError, ErrorCode } from '@/types/error-codes';
import { logger } from '@/lib/logger';
import { findGuestById } from './get-guest';
import { updateGuestPartnerId } from './_helpers';

export async function linkPartners(aId: string, bId: string): Promise<void> {
  if (aId === bId) {
    throw new AppError(ErrorCode.INVALID_LINK, 'Cannot link guest to self');
  }

  const [guestA, guestB] = await Promise.all([
    findGuestById(aId),
    findGuestById(bId),
  ]);

  if (!guestA || !guestB) {
    throw new AppError(ErrorCode.NOT_FOUND, 'One or both guests not found');
  }

  const unlinkPromises: Promise<void>[] = [];

  if (guestA.partnerId && guestA.partnerId.toString() !== bId) {
    unlinkPromises.push(updateGuestPartnerId(guestA.partnerId.toString(), null));
  }

  if (guestB.partnerId && guestB.partnerId.toString() !== aId) {
    unlinkPromises.push(updateGuestPartnerId(guestB.partnerId.toString(), null));
  }

  await Promise.all(unlinkPromises);

  await Promise.all([
    updateGuestPartnerId(aId, bId),
    updateGuestPartnerId(bId, aId),
  ]);

  logger.info('Partners linked successfully', { aId, bId });
}
