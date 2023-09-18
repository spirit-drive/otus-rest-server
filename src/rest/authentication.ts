import { RequestHandler } from 'express-serve-static-core';
import { verify } from '../utils/jwt';
import { UserDocument, UserModel } from '../models/User';
import { getToken } from '../utils/authentication';
import { AuthError, NotFoundError } from '../Errors';

export const authentication: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers as { authorization: string };
  const token = getToken(authorization);
  if (!token) return res.status(401).json(new AuthError(`token is required`));

  try {
    const { id: userId } = await verify<{ id: string }>(token);
    req.user = (await UserModel.findById(userId)) as UserDocument;
    next();
  } catch (e) {
    res.status(403).json(new NotFoundError(`user not found`));
  }
};
