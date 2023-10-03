import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import { InternalServerError, NotFoundError, ServerErrors } from '../../Errors';
import { Order, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const get: RequestHandler<StandardParams, Order | ServerErrors> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { id } = req.params;
    const query = OrderModel.findOne({ _id: id });
    if (commandId) {
      query.where('commandId', commandId);
    }
    const entity = await query;

    if (!entity) return res.status(404).json(new NotFoundError(`Order with id: "${id}" not found`));
    res.send(await prepareOrder(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
