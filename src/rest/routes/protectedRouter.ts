import { Router } from 'express';
import { profileRouter } from '../profile/profileRouter';
import { categoryRouter } from '../category/categoryRouter';
import { productRouter } from '../product/productRouter';

export const protectedRouter = Router();

protectedRouter.use('/profile', profileRouter);
protectedRouter.use('/categories', categoryRouter);
protectedRouter.use('/products', productRouter);
