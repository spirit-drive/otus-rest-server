import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Product } from '../../server.types';

export type ProductDocument = Document &
  Omit<Product, 'id' | 'category'> & {
    categoryId: string;
  };
export const ProductSchema = new mongoose.Schema<ProductDocument>({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  oldPrice: Number,
  price: {
    type: Number,
    required: true,
  },
  photo: String,
  desc: String,
  createdAt: {
    required: true,
    type: Date,
    default: () => new Date(),
  },
});

export const ProductModel = mongoose.model('Product', ProductSchema);
