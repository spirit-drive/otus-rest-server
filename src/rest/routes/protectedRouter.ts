import { Router } from 'express';
import { profileRouter } from './profileRouter';

export const protectedRouter = Router();

protectedRouter.use('/profile', profileRouter);
