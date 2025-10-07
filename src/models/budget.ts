import { Schema, model, models, type Types } from 'mongoose';

export interface IBudgetItem {
  _id: Types.ObjectId;
  title: string;
  amountCents: number;
}

export interface IBudget {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  venueName: string;
  items: IBudgetItem[];
  createdAt: Date;
  updatedAt: Date;
}

const budgetItemSchema = new Schema<IBudgetItem>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    amountCents: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const budgetSchema = new Schema<IBudget>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    venueName: { type: String, required: true, trim: true, maxlength: 200 },
    items: { type: [budgetItemSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

budgetSchema.virtual('totalCents').get(function () {
  return this.items.reduce((sum, item) => sum + item.amountCents, 0);
});

budgetSchema.index({ projectId: 1, venueName: 1 });
budgetSchema.index({ projectId: 1, createdAt: -1 });

export const BudgetModel = models.Budget || model<IBudget>('Budget', budgetSchema);
