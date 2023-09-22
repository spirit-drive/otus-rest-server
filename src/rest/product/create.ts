import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { DataBaseError, ValidationError, ServerErrors, FieldRequiredError, NotFoundError } from '../../Errors';
import { Product, ProductAddInput } from '../../server.types';
import { CategoryModel } from '../../models/Category';
import { UserDocument } from '../../models/User';

export const create: RequestHandler<never, Product | ServerErrors, ProductAddInput> = async (req, res) => {
  try {
    if (!req.body.categoryId) {
      return res.status(400).json(new FieldRequiredError(`categoryId is required`, 'categoryId'));
    }
    if (!(await CategoryModel.findById(req.body.categoryId))) {
      return res.status(400).json(new NotFoundError(`category not found`, 'categoryId'));
    }
    const entity = new ProductModel({ ...req.body, commandId: (req.user as UserDocument)?.commandId });

    // Выполняем валидацию перед сохранением
    const validationError = entity.validateSync();
    if (validationError) {
      // Если есть ошибки валидации, отправляем ValidationError
      return res.status(400).json(new ValidationError(validationError));
    }
    // Если валидация успешна, сохраняем документ
    await entity.save();
    res.send(await prepareProduct(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
