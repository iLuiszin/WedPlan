import { GuestModel, type IGuest } from '@/models/guest';
import {
  serializeDocument,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function updateGuest(
  id: string,
  updates: Partial<{
    firstName: string;
    lastName: string;
    category: 'groom' | 'bride' | 'both';
    role: 'guest' | 'groomsman' | 'bridesmaid';
    partnerId: string | null;
  }>
): Promise<SerializedDocument<IGuest> | null> {
  const guest = await GuestModel.findByIdAndUpdate(id, updates, { new: true }).exec();

  if (!guest) {
    return null;
  }

  return serializeDocument<IGuest>(guest as unknown as MongooseDocument<IGuest>);
}
