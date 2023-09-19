import { RequestHandler } from 'express-serve-static-core';
import { ChangePasswordBody, ChangePasswordResult } from '../../server.types';
import { UserDocument } from '../../models/User';
import { isValidPassword } from '../../models/User/helpers';
import { DataBaseError, IncorrectPasswordError, InvalidPasswordError, ServerErrors } from '../../Errors';

export const changePassword: RequestHandler<never, ChangePasswordResult | ServerErrors, ChangePasswordBody> = async (
  req,
  res
) => {
  const { password, newPassword } = req.body;
  const user = req.user as UserDocument;
  if (!user.isRightPassword(password)) {
    return res.status(400).json(new IncorrectPasswordError('Incorrect password'));
  }

  if (!isValidPassword(newPassword)) {
    return res.status(400).json(new InvalidPasswordError(`"${newPassword}" is not valid password`));
  }

  user.password = await user.generateHash(newPassword);

  try {
    await user.save();
  } catch (e) {
    return res.status(500).json(new DataBaseError(e));
  }

  res.send({ success: true });
};
