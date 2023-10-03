import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrder } from './prepareOrder';
import {
  InternalServerError,
  ValidationError,
  ServerErrors,
  FieldRequiredError,
  NotFoundError,
  NotValidIdError,
} from '../../Errors';
import { Order, OrderAddInput } from '../../server.types';
import { UserDocument } from '../../models/User';
import { isExistProducts } from './helpers';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const create: RequestHandler<never, Order | ServerErrors, OrderAddInput> = async (req, res) => {
  try {
    if (!req.body.products?.length) {
      return res.status(400).json(new FieldRequiredError(`productIds is required`, 'products'));
    }
    if (req.body.products.some((i) => !ObjectId.isValid(i.id))) {
      return res.status(400).json(new NotValidIdError(`not all product ids are valid`, 'products'));
    }
    if (!(await isExistProducts(req.body.products.map((i) => i.id)))) {
      return res.status(400).json(new NotFoundError(`not all products found`, 'products'));
    }
    const user = req.user as UserDocument;
    const entity = new OrderModel({ ...req.body, userId: user._id, commandId: user?.commandId });

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
    res.status(500).json(new InternalServerError(e));
  }
};
