import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import { DataBaseError, NotFoundError, ServerErrors } from '../../Errors';
import { Order, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Order | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await OrderModel.findOneAndRemove({ _id: id, commandId });

    if (!entity) return res.status(404).json(new NotFoundError(`Order with id: "${id}" not found`));
    res.send(await prepareOrder(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
