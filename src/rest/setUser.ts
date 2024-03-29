import { RequestHandler } from 'express-serve-static-core';
import { verify } from '../utils/jwt';
import { UserDocument, UserModel } from '../models/User';
import { getToken } from '../utils/authentication';
import { AuthError } from '../Errors';

export const authentication: RequestHandler = async (req, res, next) => {
  if (!req.user) return res.status(401).json(new AuthError(`token is required`));

  next();
};

export const setUser: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers as { authorization: string };
  const token = getToken(authorization);
  if (!token) return next();

  try {
    const { id: userId } = await verify<{ id: string }>(token);
    req.user = (await UserModel.findById(userId)) as UserDocument;
    next();
  } catch (e) {
    res.status(401).json(new AuthError(`user not found`));
  }
};
