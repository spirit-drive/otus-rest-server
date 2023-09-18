import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Message } from '../../server.types';
// import { saveMessageHook } from '../../socket/setSocket';

export type MessageDocument = Document &
  Omit<Message, 'author'> & {
    authorId: string;
  };

export const MessageSchema = new mongoose.Schema<MessageDocument>({
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  date: {
    required: true,
    type: Date,
    default: () => new Date(),
  },
});

// MessageSchema.post('save', saveMessageHook);
export const MessageModel = mongoose.model('Message', MessageSchema);
