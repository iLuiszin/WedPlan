import { GuestModel, type IGuest } from '@/models/guest';
import {
  serializeDocument,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function findGuestById(id: string): Promise<SerializedDocument<IGuest> | null> {
  const guest = await GuestModel.findById(id).exec();

  if (!guest) {
    return null;
  }

  return serializeDocument<IGuest>(guest as unknown as MongooseDocument<IGuest>);
}
