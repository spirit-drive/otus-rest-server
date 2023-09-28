import { Router } from 'express';
import { authRouter } from './authRouter';
import { profileRouter } from '../profile/profileRouter';
import { categoryRouter, protectedCategoryRouter } from '../category/categoryRouter';
import { productRouter, protectedProductRouter } from '../product/productRouter';
import { operationRouter, protectedOperationRouter } from '../operation/operationRouter';
import { orderRouter, protectedOrderRouter } from '../order/orderRouter';
import { uploadRouter } from './uploadRouter';
import { authentication } from '../authentication';

export const mainRouter = Router();

mainRouter.use(authRouter);
mainRouter.use('/profile', authentication, profileRouter);
mainRouter.use('/categories', categoryRouter);
mainRouter.use('/categories', authentication, protectedCategoryRouter);
mainRouter.use('/products', productRouter);
mainRouter.use('/products', authentication, protectedProductRouter);
mainRouter.use('/operations', operationRouter);
mainRouter.use('/operations', authentication, protectedOperationRouter);
mainRouter.use('/orders', orderRouter);
mainRouter.use('/orders', authentication, protectedOrderRouter);
mainRouter.use('/upload', authentication, uploadRouter);
