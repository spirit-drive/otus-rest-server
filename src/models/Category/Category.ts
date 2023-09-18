import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Category } from '../../server.types';

export type CategoryDocument = Document & Omit<Category, 'id'>;
export const CategorySchema = new mongoose.Schema<CategoryDocument>({
  name: {
    type: String,
    required: true,
  },
  photo: String,
  createdAt: {
    required: true,
    type: Date,
    default: () => new Date(),
  },
});

export const CategoryModel = mongoose.model('Category', CategorySchema);
