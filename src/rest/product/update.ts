import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { DataBaseError, ValidationError, ServerErrors } from '../../Errors';
import { Product, ProductUpdateInput, StandardParams } from '../../server.types';
import { updateModel } from '../helpers';

export const update: (patch?: boolean) => RequestHandler<StandardParams, Product | ServerErrors, ProductUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { id } = req.params;
      const entity = await ProductModel.findById(id);
      updateModel(req.body, entity, ['name', 'photo', 'categoryId', 'desc', 'oldPrice', 'price'], patch);

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
