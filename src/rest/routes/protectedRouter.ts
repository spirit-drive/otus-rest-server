import { Router } from 'express';
import { profileRouter } from '../profile/profileRouter';
import { categoryRouter } from '../category/categoryRouter';

export const protectedRouter = Router();

protectedRouter.use('/profile', profileRouter);
protectedRouter.use('/categories', categoryRouter);
