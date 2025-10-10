import { GuestModel, type IGuest } from '@/models/guest';
import {
  serializeDocuments,
  type MongooseDocument,
  type SerializedDocument,
} from '@/types/mongoose-helpers';

export async function findGuestsByProject(projectId: string): Promise<SerializedDocument<IGuest>[]> {
  const guests = await GuestModel.find()
    .where('projectId')
    .equals(projectId)
    .sort({ lastName: 1, firstName: 1 })
    .exec();

  return serializeDocuments<IGuest>(guests as unknown as MongooseDocument<IGuest>[]);
}
