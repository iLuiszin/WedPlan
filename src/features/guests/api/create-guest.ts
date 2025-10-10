import { GuestModel, type IGuest } from '@/models/guest';
import {
  serializeDocument,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function createGuest(data: {
  projectId: string;
  firstName: string;
  lastName?: string;
  category: 'groom' | 'bride' | 'both';
  role: 'guest' | 'groomsman' | 'bridesmaid';
  partnerId?: string | null;
}): Promise<SerializedDocument<IGuest>> {
  const guest = await GuestModel.create(data);
  return serializeDocument<IGuest>(guest as unknown as MongooseDocument<IGuest>);
}
