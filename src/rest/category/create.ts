import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { DataBaseError, ValidationError, ServerErrorJson } from '../../Errors';
import { Category, CategoryAddInput } from '../../server.types';

export const create: RequestHandler<never, Category | ServerErrorJson, CategoryAddInput> = async (req, res) => {
  try {
    const { name, photo } = req.body;
    const entity = new CategoryModel({ name, photo });

    // Выполняем валидацию перед сохранением
    const validationError = entity.validateSync();
    if (validationError) {
      // Если есть ошибки валидации, отправляем ValidationError
      res.status(400).json(new ValidationError(validationError.message));
    } else {
      // Если валидация успешна, сохраняем документ
      await entity.save();
      res.send(await prepareCategory(entity));
    }
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
