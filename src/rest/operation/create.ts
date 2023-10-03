import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import {
  InternalServerError,
  ValidationError,
  ServerErrors,
  FieldRequiredError,
  NotFoundError,
  NotValidIdError,
} from '../../Errors';
import { Operation, OperationAddInput } from '../../server.types';
import { CategoryModel } from '../../models/Category';
import { UserDocument } from '../../models/User';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const create: RequestHandler<never, Operation | ServerErrors, OperationAddInput> = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.body.categoryId)) {
      return res.status(400).json(new NotValidIdError(`categoryId is not valid`, 'categoryId'));
    }
    if (!req.body.categoryId) {
      return res.status(400).json(new FieldRequiredError(`categoryId is required`, 'categoryId'));
    }
    if (!(await CategoryModel.findById(req.body.categoryId))) {
      return res.status(400).json(new NotFoundError(`category not found`, 'categoryId'));
    }
    const entity = new OperationModel({ ...req.body, commandId: (req.user as UserDocument)?.commandId });

    // Выполняем валидацию перед сохранением
    const validationError = entity.validateSync();
    if (validationError) {
      // Если есть ошибки валидации, отправляем ValidationError
      return res.status(400).json(new ValidationError(validationError));
    }
    // Если валидация успешна, сохраняем документ
    await entity.save();
    res.send(await prepareOperation(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
