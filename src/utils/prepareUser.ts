import { UserDocument } from '../models/User';
import { User } from '../server.types';

export const prepareUser = (item: UserDocument): User =>
  item
    ? {
        id: item._id.toString(),
        name: item.name,
      }
    : null;
