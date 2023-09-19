import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { DataBaseError, ValidationError, ServerErrorJson } from '../../Errors';
import { Product, ProductUpdateInput, StandardParams } from '../../server.types';

export const update: (
  patch?: boolean
) => RequestHandler<StandardParams, Product | ServerErrorJson, ProductUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { name, photo } = req.body;
      const { id } = req.params;
      const entity = await ProductModel.findByIdAndUpdate(id, { name, photo }, { overwrite: !patch, new: true });

      // Выполняем валидацию перед сохранением
      const validationError = entity.validateSync();
      if (validationError) {
        // Если есть ошибки валидации, отправляем ValidationError
        return res.status(400).json(new ValidationError(validationError.message));
      }
      // Если валидация успешна, сохраняем документ
      await entity.save();
      res.send(await prepareProduct(entity));
    } catch (e) {
      res.status(500).json(new DataBaseError(e));
    }
  };
