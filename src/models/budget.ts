import { Schema, model, models, type Types } from 'mongoose';

export interface IBudgetItem {
  _id: Types.ObjectId | string;
  title: string;
  amountCents: number;
}

export interface ICategoryField {
  _id: Types.ObjectId | string;
  key: string;
  value: string;
  fieldType: 'text' | 'number' | 'currency' | 'date';
  itemType: 'information' | 'expense';
}

export interface IProvider {
  _id: Types.ObjectId | string;
  name: string;
  fields: ICategoryField[];
  notes: string;
  amountCents?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: Types.ObjectId | string;
  name: string;
  providers: IProvider[];
}

export interface IBudget {
  _id: Types.ObjectId | string;
  projectId: Types.ObjectId | string;
  items: IBudgetItem[];
  categories: ICategory[];
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

const categoryFieldSchema = new Schema<ICategoryField>(
  {
    key: { type: String, required: true, trim: true, maxlength: 100 },
    value: { type: String, required: true, trim: true, maxlength: 500 },
    fieldType: {
      type: String,
      required: true,
      enum: ['text', 'number', 'currency', 'date'],
      default: 'text',
    },
    itemType: {
      type: String,
      required: true,
      enum: ['information', 'expense'],
      default: 'information',
    },
  },
  { _id: true }
);

const providerSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    fields: { type: [categoryFieldSchema], default: [] },
    notes: { type: String, trim: true, maxlength: 1000, default: '' },
    amountCents: { type: Number, min: 0, default: 0 },
  },
  { _id: true, timestamps: true }
);

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    providers: { type: [providerSchema], default: [] },
  },
  { _id: true }
);

const budgetSchema = new Schema<IBudget>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    items: { type: [budgetItemSchema], default: [] },
    categories: { type: [categorySchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

budgetSchema.virtual('totalCents').get(function () {
  const itemsTotal = this.items.reduce((sum, item) => sum + item.amountCents, 0);
  const categoriesTotal = this.categories.reduce((sum, category) => {
    return sum + category.providers.reduce((provSum, provider) => provSum + (provider.amountCents ?? 0), 0);
  }, 0);
  return itemsTotal + categoriesTotal;
});

budgetSchema.index({ projectId: 1, createdAt: -1 });

export const BudgetModel = models.Budget || model<IBudget>('Budget', budgetSchema);
