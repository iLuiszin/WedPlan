'use server';

import { createGuestSchema, updateGuestSchema } from '@/schemas/guest-schema';
import { GuestRepository } from '@/repositories/guest-repository';
import { GuestService } from '@/services/guest-service';
import { AppError, ErrorCode } from '@/types/error-codes';
import { withAction, withValidatedAction } from '@/lib/action-wrapper';

const guestRepository = new GuestRepository();
const guestService = new GuestService(guestRepository);

export const createGuestAction = withValidatedAction(
  async (input: typeof createGuestSchema._output) => {
    return await guestRepository.create(input);
  },
  {
    schema: createGuestSchema,
    revalidate: '/guests',
    operationName: 'Create guest',
  }
);

export const updateGuestAction = withValidatedAction(
  async (input: typeof updateGuestSchema._output) => {
    const { _id, ...updates } = input;
    const guest = await guestRepository.update(_id, updates);

    if (!guest) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Guest not found');
    }

    return guest;
  },
  {
    schema: updateGuestSchema,
    revalidate: '/guests',
    operationName: 'Update guest',
  }
);

export const deleteGuestAction = withAction(
  async (id: string) => {
    const guest = await guestRepository.findById(id);

    if (!guest) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Guest not found');
    }

    if (guest.partnerId) {
      await guestRepository.updatePartnerId(guest.partnerId.toString(), null);
    }

    await guestRepository.delete(id);
  },
  {
    revalidate: '/guests',
    operationName: 'Delete guest',
  }
);

export const linkPartnersAction = withAction(
  async ({ aId, bId }: { aId: string; bId: string }) => {
    await guestService.linkPartners(aId, bId);
  },
  {
    revalidate: '/guests',
    operationName: 'Link partners',
  }
);

export const unlinkPartnerAction = withAction(
  async (id: string) => {
    await guestService.unlinkPartner(id);
  },
  {
    revalidate: '/guests',
    operationName: 'Unlink partner',
  }
);

export const getGuestsAction = withAction(
  async (projectId: string) => {
    return await guestRepository.findByProject(projectId);
  },
  {
    operationName: 'Get guests',
  }
);
