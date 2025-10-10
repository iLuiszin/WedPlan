import { Schema, model, models, type Model, type Types } from 'mongoose';

export interface IProject {
  _id: Types.ObjectId;
  slug: string;
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  weddingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, trim: true, maxlength: 120, unique: true, index: true },
    brideFirstName: { type: String, required: true, trim: true, maxlength: 100 },
    brideLastName: { type: String, required: true, trim: true, maxlength: 100 },
    groomFirstName: { type: String, required: true, trim: true, maxlength: 100 },
    groomLastName: { type: String, required: true, trim: true, maxlength: 100 },
    weddingDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual('brideName').get(function () {
  return `${this.brideFirstName} ${this.brideLastName}`;
});

projectSchema.virtual('groomName').get(function () {
  return `${this.groomFirstName} ${this.groomLastName}`;
});

export const ProjectModel: Model<IProject> =
  (models.Project as Model<IProject> | undefined) ?? model<IProject>('Project', projectSchema);
