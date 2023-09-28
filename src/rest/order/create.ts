import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import { DataBaseError, ValidationError, ServerErrors, FieldRequiredError, NotFoundError } from '../../Errors';
import { Order, OrderAddInput } from '../../server.types';
import { UserDocument, UserModel } from '../../models/User';
import { isExistProducts } from './helpers';

export const create: RequestHandler<never, Order | ServerErrors, OrderAddInput> = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json(new FieldRequiredError(`userId is required`, 'userId'));
    }
    if (!req.body.products?.length) {
      return res.status(400).json(new FieldRequiredError(`productIds is required`, 'products'));
    }
    if (!(await UserModel.findById(req.body.userId))) {
      return res.status(400).json(new NotFoundError(`user not found`, 'userId'));
    }
    if (!(await isExistProducts(req.body.products.map((i) => i.id)))) {
      return res.status(400).json(new NotFoundError(`not all products found`, 'products'));
    }
    const entity = new OrderModel({ ...req.body, commandId: (req.user as UserDocument)?.commandId });

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
