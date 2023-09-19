import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import { DataBaseError, NotFoundError, ServerErrors } from '../../Errors';
import { Order, StandardParams } from '../../server.types';

export const remove: RequestHandler<StandardParams, Order | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await OrderModel.findByIdAndRemove(id);

    if (!entity) return res.status(500).json(new NotFoundError(`Order with id: "${id}" not found`));
    res.send(await prepareOrder(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
