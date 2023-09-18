import { RequestHandler } from 'express-serve-static-core';
import { Profile } from '../../server.types';
import { prepareProfile } from './prepareProfile';
import { UserDocument } from '../../models/User';
import { ServerErrorJson } from '../../Errors';

export const profile: RequestHandler<never, Profile | ServerErrorJson> = async (req, res) => {
  try {
    res.send(prepareProfile(req.user as UserDocument));
  } catch (error) {
    res.status(400).json({ error });
  }
};
