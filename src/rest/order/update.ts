import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import { DataBaseError, ValidationError, ServerErrors, NotFoundError } from '../../Errors';
import { Order, OrderUpdateInput, StandardParams } from '../../server.types';
import { updateModel } from '../helpers';
import { UserDocument } from '../../models/User';

export const update: (patch?: boolean) => RequestHandler<StandardParams, Order | ServerErrors, OrderUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { id } = req.params;
      const { commandId } = (req.user || {}) as UserDocument;
      const entity = await OrderModel.findOne({ _id: id, commandId });
      if (!entity) return res.status(500).json(new NotFoundError(`Order with id: "${id}" not found`));
      updateModel(req.body, entity, ['productIds', 'userId', 'status'], patch);

      // Выполняем валидацию перед сохранением
      const validationError = entity.validateSync();
      if (validationError) {
        // Если есть ошибки валидации, отправляем ValidationError
        return res.status(400).json(new ValidationError(validationError));
      }
      // Если валидация успешна, сохраняем документ
      await entity.save();
      res.send(await prepareOrder(entity));
    } catch (e) {
      res.status(500).json(new DataBaseError(e));
    }
  };
