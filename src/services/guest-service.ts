/* eslint-disable @typescript-eslint/consistent-type-imports */
import { GuestRepository } from '@/repositories/guest-repository';
import { AppError, ErrorCode } from '@/types/error-codes';
import { logger } from '@/lib/logger';

export class GuestService {
  constructor(private readonly repository: GuestRepository) {}

  async linkPartners(aId: string, bId: string): Promise<void> {
    if (aId === bId) {
      throw new AppError(ErrorCode.INVALID_LINK, 'Cannot link guest to self');
    }

    const [guestA, guestB] = await Promise.all([
      this.repository.findById(aId),
      this.repository.findById(bId),
    ]);

    if (!guestA || !guestB) {
      throw new AppError(ErrorCode.NOT_FOUND, 'One or both guests not found');
    }

    // Unlink previous partners if they exist and are different
    const unlinkPromises: Promise<void>[] = [];

    if (guestA.partnerId && guestA.partnerId.toString() !== bId) {
      unlinkPromises.push(this.repository.updatePartnerId(guestA.partnerId.toString(), null));
    }

    if (guestB.partnerId && guestB.partnerId.toString() !== aId) {
      unlinkPromises.push(this.repository.updatePartnerId(guestB.partnerId.toString(), null));
    }

    await Promise.all(unlinkPromises);

    // Link bidirectionally
    await Promise.all([
      this.repository.updatePartnerId(aId, bId),
      this.repository.updatePartnerId(bId, aId),
    ]);

    logger.info('Partners linked successfully', { aId, bId });
  }

  async unlinkPartner(id: string): Promise<void> {
    const guest = await this.repository.findById(id);

    if (!guest) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Guest not found');
    }

    if (guest.partnerId) {
      await this.repository.updatePartnerId(guest.partnerId.toString(), null);
    }

    await this.repository.updatePartnerId(id, null);

    logger.info('Partner unlinked successfully', { guestId: id });
  }
}
