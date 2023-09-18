import { UserDocument } from '../../models/User';
import { Profile } from '../../server.types';

export const prepareProfile = (item: UserDocument): Profile =>
  item
    ? {
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        signUpDate: item.signUpDate,
      }
    : ({} as Profile);
