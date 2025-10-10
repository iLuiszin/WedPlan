import type { IGuest } from '@/models/guest';
import type { SerializedDocument } from '@/types/mongoose-helpers';

export type SerializedGuest = SerializedDocument<IGuest>;

export interface GuestCouple {
  partnerA: SerializedGuest;
  partnerB: SerializedGuest;
}

export type { IGuest };
export type {
  CreateGuestInput,
  UpdateGuestInput,
  GuestCategory,
  GuestRole,
} from '@/schemas/guest-schema';
