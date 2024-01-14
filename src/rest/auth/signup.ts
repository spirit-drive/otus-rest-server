import { RequestHandler } from 'express-serve-static-core';
import { AuthResult, SignUpBody } from '../../server.types';
import { UserDocument, UserModel } from '../../models/User';
import { AccountAlreadyExistError, InternalServerError, ValidationError, ServerErrors } from '../../Errors';
import { sign } from '../../utils/jwt';

export const signup: RequestHandler<never, AuthResult | ServerErrors, SignUpBody> = async (req, res) => {
  const { password, email, commandId } = req.body;

  let foundUsers;
  try {
    foundUsers = (await UserModel.findOne({ email })) as UserDocument;
  } catch (e) {
    return res.status(400).json(new InternalServerError(e));
  }
  if (foundUsers) {
    return res.status(400).json(new AccountAlreadyExistError(`User with email: ${foundUsers.email} already exist`));
  }
  const user = new UserModel() as UserDocument;
  user.email = email;
  user.commandId = commandId;
  user.password = await user.generateHash(password);

  const validationError = user.validateSync();
  if (validationError) {
    // Если есть ошибки валидации, отправляем ValidationError
    return res.status(400).json(new ValidationError(validationError));
  }

  try {
    await user.save();
  } catch (e) {
    return res.status(400).json(new InternalServerError(e));
  }

  const token = sign({ id: user._id });
  res.send({ token, profile: user });
};
