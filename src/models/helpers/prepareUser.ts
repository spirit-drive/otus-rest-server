import { UserDocument, UserModel } from '../User';
import { Message, User } from '../../server.types';
import { MessageDocument } from '../Message';

export const prepareUser = (item: UserDocument): User => {
  if (!item) return {} as User;

  const raw = item.toObject();
  return {
    id: raw._id.toString(),
    name: raw.name,
  };
};
export const prepareMessage = async (item: MessageDocument): Promise<Message> => {
  if (!item) return {} as Message;

  const raw = item.toObject();
  return {
    id: raw._id.toString(),
    content: raw.content,
    chatId: raw.chatId,
    author: prepareUser(await UserModel.findById(raw.authorId)),
    date: new Date(raw.date),
  };
};

export const prepareMessages = async (items: MessageDocument[]): Promise<Message[]> => {
  if (!items?.length) return [] as Message[];

  const result: Message[] = [];
  for await (const item of items) {
    result.push(await prepareMessage(item));
  }
  return result;
};
