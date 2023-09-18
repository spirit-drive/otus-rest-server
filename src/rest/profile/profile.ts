import { ParamsDictionary, RequestHandler } from 'express-serve-static-core';
import { Profile } from '../../server.types';
import { prepareProfile } from './prepareProfile';
import { UserDocument } from '../../models/User';

export const profile: RequestHandler<ParamsDictionary, Profile | { error: Error }> = async (req, res) => {
  try {
    res.send(prepareProfile(req.user as UserDocument));
  } catch (error) {
    res.status(400).json({ error });
  }
};
