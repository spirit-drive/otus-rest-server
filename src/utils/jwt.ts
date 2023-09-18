import * as jwt from 'jsonwebtoken';
import * as config from '../config.json';

export type Params = Record<string, unknown>;

export const sign = (params: Params): string => jwt.sign(params, config.jwtsecret, { expiresIn: config.expiresIn });

export const verify = async <T extends Params>(token: string): Promise<T> =>
  (await jwt.verify(token, config.jwtsecret)) as T;
