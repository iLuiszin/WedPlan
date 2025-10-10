import { AppError, ErrorCode } from '@/types/error-codes';
import { logger } from '@/lib/logger';
import { findGuestById } from './get-guest';
import { updateGuestPartnerId } from './_helpers';

export async function unlinkPartner(id: string): Promise<void> {
  const guest = await findGuestById(id);

  if (!guest) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Guest not found');
  }

  if (guest.partnerId) {
    await updateGuestPartnerId(guest.partnerId.toString(), null);
  }

  await updateGuestPartnerId(id, null);

  logger.info('Partner unlinked successfully', { guestId: id });
}
