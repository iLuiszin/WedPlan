import { GuestModel } from '@/models/guest';

export async function deleteGuest(id: string): Promise<boolean> {
  const result = await GuestModel.findByIdAndDelete(id).exec();
  return result !== null;
}
