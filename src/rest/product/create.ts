import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { DataBaseError, ValidationError, ServerErrorJson } from '../../Errors';
import { Product, ProductAddInput } from '../../server.types';

export const create: RequestHandler<never, Product | ServerErrorJson, ProductAddInput> = async (req, res) => {
  try {
    const { name, photo } = req.body;
    const entity = new ProductModel({ name, photo });

    // Выполняем валидацию перед сохранением
    const validationError = entity.validateSync();
    if (validationError) {
      // Если есть ошибки валидации, отправляем ValidationError
      res.status(400).json(new ValidationError(validationError.message));
    } else {
      // Если валидация успешна, сохраняем документ
      await entity.save();
      res.send(await prepareProduct(entity));
    }
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
