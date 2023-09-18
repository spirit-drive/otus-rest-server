import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { DataBaseError, ValidationError, ServerErrorJson } from '../../Errors';
import { Category, CategoryUpdateInput, StandardParams } from '../../server.types';

export const update: (
  patch?: boolean
) => RequestHandler<StandardParams, Category | ServerErrorJson, CategoryUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { name, photo } = req.body;
      const { id } = req.params;
      const entity = await CategoryModel.findByIdAndUpdate(id, { name, photo }, { overwrite: !patch, new: true });

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
