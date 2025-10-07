import { Schema, model, models, type Types } from 'mongoose';

export interface IGuest {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  firstName: string;
  lastName: string;
  category: 'groom' | 'bride' | 'both';
  role: 'guest' | 'groomsman' | 'bridesmaid';
  partnerId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const guestSchema = new Schema<IGuest>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    category: {
      type: String,
      required: true,
      enum: ['groom', 'bride', 'both'],
      default: 'both',
    },
    role: {
      type: String,
      required: true,
      enum: ['guest', 'groomsman', 'bridesmaid'],
      default: 'guest',
    },
    partnerId: { type: Schema.Types.ObjectId, ref: 'Guest', default: null, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

guestSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

guestSchema.index({ projectId: 1, lastName: 1, firstName: 1 });
guestSchema.index({ projectId: 1, category: 1 });
guestSchema.index({ projectId: 1, role: 1 });

export const GuestModel = models.Guest || model<IGuest>('Guest', guestSchema);
