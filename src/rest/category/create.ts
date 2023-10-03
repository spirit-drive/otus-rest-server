import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { InternalServerError, ValidationError, ServerErrors } from '../../Errors';
import { Category, CategoryAddInput } from '../../server.types';
import { UserDocument } from '../../models/User';

export const create: RequestHandler<never, Category | ServerErrors, CategoryAddInput> = async (req, res) => {
  try {
    const entity = new CategoryModel({ ...req.body, commandId: (req.user as UserDocument)?.commandId });

    // Выполняем валидацию перед сохранением
    const validationError = entity.validateSync();
    if (validationError) {
      // Если есть ошибки валидации, отправляем ValidationError
      return res.status(400).json(new ValidationError(validationError));
    }
    // Если валидация успешна, сохраняем документ
    await entity.save();
    res.send(await prepareCategory(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
