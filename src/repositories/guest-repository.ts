import { GuestModel, type IGuest } from '@/models/guest';
import { connectToDatabase } from '@/lib/db';
import type { SerializedDocument } from '@/types/mongoose-helpers';

export class GuestRepository {
  async findByProject(projectId: string): Promise<SerializedDocument<IGuest>[]> {
    await connectToDatabase();
    const guests = await GuestModel.find({ projectId })
      .sort({ lastName: 1, firstName: 1 })
      .lean()
      .exec();

    return JSON.parse(JSON.stringify(guests)) as SerializedDocument<IGuest>[];
  }

  async findById(id: string): Promise<SerializedDocument<IGuest> | null> {
    await connectToDatabase();
    const guest = await GuestModel.findById(id).lean().exec();

    if (!guest) {
      return null;
    }

    return JSON.parse(JSON.stringify(guest)) as SerializedDocument<IGuest>;
  }

  async create(data: {
    projectId: string;
    firstName: string;
    lastName: string;
    category: 'groom' | 'bride' | 'both';
    role: 'guest' | 'groomsman' | 'bridesmaid';
    partnerId?: string | null;
  }): Promise<SerializedDocument<IGuest>> {
    await connectToDatabase();
    const guest = await GuestModel.create(data);
    const created = await GuestModel.findById(guest._id).lean().exec();
    return JSON.parse(JSON.stringify(created)) as SerializedDocument<IGuest>;
  }

  async update(
    id: string,
    updates: Partial<{
      firstName: string;
      lastName: string;
      category: 'groom' | 'bride' | 'both';
      role: 'guest' | 'groomsman' | 'bridesmaid';
      partnerId: string | null;
    }>
  ): Promise<SerializedDocument<IGuest> | null> {
    await connectToDatabase();
    const guest = await GuestModel.findByIdAndUpdate(id, updates, { new: true }).lean().exec();

    if (!guest) {
      return null;
    }

    return JSON.parse(JSON.stringify(guest)) as SerializedDocument<IGuest>;
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await GuestModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async updatePartnerId(
    id: string,
    partnerId: string | null
  ): Promise<void> {
    await connectToDatabase();
    await GuestModel.findByIdAndUpdate(id, { partnerId }).exec();
  }
}
