import { GuestModel } from '@/models/guest';

export async function updateGuestPartnerId(
  id: string,
  partnerId: string | null
): Promise<void> {
  await GuestModel.findByIdAndUpdate(id, { partnerId }).exec();
}
