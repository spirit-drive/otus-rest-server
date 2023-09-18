import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Operation } from '../../server.types';

export type OperationDocument = Document &
  Omit<Operation, 'id' | 'category'> & {
    categoryId: string;
  };
export const OperationSchema = new mongoose.Schema<OperationDocument>({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Profit', 'Cost'],
  },
  amount: {
    type: Number,
    required: true,
  },
  desc: String,
  createdAt: {
    required: true,
    type: Date,
    default: () => new Date(),
  },
});

export const OperationModel = mongoose.model('Operation', OperationSchema);
