import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Order } from '../../server.types';

export type OrderDocument = Document &
  Omit<Order, 'id' | 'products'> & {
    productIds: string[];
  };
export const OrderSchema = new mongoose.Schema<OrderDocument>({
  productIds: {
    type: [String],
    required: true,
  },
  createdAt: {
    required: true,
    type: Date,
    default: () => new Date(),
  },
});

export const OrderModel = mongoose.model('Order', OrderSchema);
