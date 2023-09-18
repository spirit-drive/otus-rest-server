import { Router } from 'express';
import { authRouter } from './authRouter';
import { protectedRouter } from './protectedRouter';
import { authentication } from '../authentication';

export const mainRouter = Router();

mainRouter.use(authRouter);
mainRouter.use(authentication, protectedRouter);
