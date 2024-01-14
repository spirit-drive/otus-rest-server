import { RequestHandler } from 'express-serve-static-core';
import { AuthResult, SignInBody } from '../../server.types';
import { UserDocument, UserModel } from '../../models/User';
import { InternalServerError, IncorrectEmailOrPasswordError, ServerErrors } from '../../Errors';
import { sign } from '../../utils/jwt';

export const signin: RequestHandler<never, AuthResult | ServerErrors, SignInBody> = async (req, res) => {
  const { password, email } = req.body;
  let user: UserDocument;
  try {
    user = (await UserModel.findOne({ email })) as UserDocument;
  } catch (e) {
    return res.status(400).json(new InternalServerError(e));
  }
  if (!user || !user.isRightPassword(password)) {
    return res.status(400).json(new IncorrectEmailOrPasswordError('User not found or invalid password'));
  }

  const token = sign({ id: user._id });
  res.send({ token, profile: user });
};
