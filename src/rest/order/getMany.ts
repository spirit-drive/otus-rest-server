import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrders } from './prepareOrder';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Order, OrderGetManyInput } from '../../server.types';

export const getMany: RequestHandler<never, Order[] | ServerErrors, OrderGetManyInput> = async (req, res) => {
  try {
    const { ids, userId, productIds } = req.body;
    const query = OrderModel.find();
    if (ids?.length) {
      query.where('_id', { $in: ids });
    }
    if (userId) {
      query.where('userId', userId);
    }
    if (productIds?.length) {
      query.where('productIds').in(productIds);
    }
    const entities = await query;

    res.send(await prepareOrders(entities));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
