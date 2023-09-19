import { RequestHandler } from 'express-serve-static-core';
import { Profile } from '../../server.types';
import { prepareProfile } from './prepareProfile';
import { UserDocument } from '../../models/User';
import { ServerErrors } from '../../Errors';

export const profile: RequestHandler<never, Profile | ServerErrors> = async (req, res) => {
  try {
    res.send(prepareProfile(req.user as UserDocument));
  } catch (error) {
    res.status(400).json({ errors: [error] });
  }
};
