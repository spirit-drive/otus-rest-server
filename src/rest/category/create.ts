import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { DataBaseError, ValidationError, ServerErrors } from '../../Errors';
import { Category, CategoryAddInput } from '../../server.types';

export const create: RequestHandler<never, Category | ServerErrors, CategoryAddInput> = async (req, res) => {
  try {
    const entity = new CategoryModel(req.body);

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
    res.status(500).json(new DataBaseError(e));
  }
};
