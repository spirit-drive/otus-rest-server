import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import { DataBaseError, ValidationError, ServerErrors, NotFoundError, NotAllowedError } from '../../Errors';
import { Order, OrderUpdateInput, StandardParams } from '../../server.types';
import { updateModel } from '../helpers';
import { UserDocument } from '../../models/User';
import { isExistProducts } from './helpers';

export const update: (patch?: boolean) => RequestHandler<StandardParams, Order | ServerErrors, OrderUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { id } = req.params;
      const { commandId, id: userId } = (req.user || {}) as UserDocument;
      if (req.body.products && !(await isExistProducts(req.body.products.map((i) => i.id)))) {
        return res.status(400).json(new NotFoundError(`not all products found`, 'products'));
      }

      const entity = await OrderModel.findOne({ _id: id, commandId });
      if (!entity) return res.status(404).json(new NotFoundError(`Order with id: "${id}" not found`));
      if (entity.userId !== userId) {
        return res.status(403).json(new NotAllowedError(`The order can only be edited by the creator`));
      }

      updateModel(req.body, entity, ['products', 'userId', 'status'], patch);

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
