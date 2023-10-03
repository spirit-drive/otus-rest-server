import { Router } from 'express';
import { authRouter } from './authRouter';
import { profileRouter } from '../profile/profileRouter';
import { categoryRouter, protectedCategoryRouter } from '../category/categoryRouter';
import { productRouter, protectedProductRouter } from '../product/productRouter';
import { operationRouter, protectedOperationRouter } from '../operation/operationRouter';
import { orderRouter, protectedOrderRouter } from '../order/orderRouter';
import { uploadRouter } from './uploadRouter';
import { setUser, authentication } from '../setUser';

export const mainRouter = Router();
export const routerWithUser = Router();

routerWithUser.use('/profile', authentication, profileRouter);
routerWithUser.use('/categories', categoryRouter);
routerWithUser.use('/categories', authentication, protectedCategoryRouter);
routerWithUser.use('/products', productRouter);
routerWithUser.use('/products', authentication, protectedProductRouter);
routerWithUser.use('/operations', operationRouter);
routerWithUser.use('/operations', authentication, protectedOperationRouter);
routerWithUser.use('/orders', orderRouter);
routerWithUser.use('/orders', authentication, protectedOrderRouter);
routerWithUser.use('/upload', authentication, uploadRouter);

mainRouter.use(authRouter);
mainRouter.use(setUser, routerWithUser);
