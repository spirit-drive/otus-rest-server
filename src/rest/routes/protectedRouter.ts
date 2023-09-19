import { Router } from 'express';
import { profileRouter } from '../profile/profileRouter';
import { categoryRouter } from '../category/categoryRouter';
import { productRouter } from '../product/productRouter';
import { operationRouter } from '../operation/operationRouter';
import { orderRouter } from '../order/orderRouter';

export const protectedRouter = Router();

protectedRouter.use('/profile', profileRouter);
protectedRouter.use('/categories', categoryRouter);
protectedRouter.use('/products', productRouter);
protectedRouter.use('/operations', operationRouter);
protectedRouter.use('/orders', orderRouter);
