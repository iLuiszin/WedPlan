'use server';

import { createGuestSchema, updateGuestSchema } from '@/schemas/guest-schema';
import { AppError, ErrorCode } from '@/types/error-codes';
import { withAction, withValidatedAction } from '@/lib/action-wrapper';
import { createGuest } from './api/create-guest';
import { updateGuest } from './api/update-guest';
import { deleteGuest } from './api/delete-guest';
import { findGuestById } from './api/get-guest';
import { findGuestsByProject } from './api/get-guests';
import { linkPartners } from './api/link-partners';
import { unlinkPartner } from './api/unlink-partner';
import { updateGuestPartnerId } from './api/_helpers';

export const createGuestAction = withValidatedAction(
  async (input: typeof createGuestSchema._output) => {
    return await createGuest(input);
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
    const guest = await updateGuest(_id, updates);

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
    const guest = await findGuestById(id);

    if (!guest) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Guest not found');
    }

    if (guest.partnerId) {
      await updateGuestPartnerId(guest.partnerId.toString(), null);
    }

    await deleteGuest(id);
  },
  {
    revalidate: '/guests',
    operationName: 'Delete guest',
  }
);

export const linkPartnersAction = withAction(
  async ({ aId, bId }: { aId: string; bId: string }) => {
    await linkPartners(aId, bId);
  },
  {
    revalidate: '/guests',
    operationName: 'Link partners',
  }
);

export const unlinkPartnerAction = withAction(
  async (id: string) => {
    await unlinkPartner(id);
  },
  {
    revalidate: '/guests',
    operationName: 'Unlink partner',
  }
);

export const getGuestsAction = withAction(
  async (projectId: string) => {
    return await findGuestsByProject(projectId);
  },
  {
    operationName: 'Get guests',
  }
);
