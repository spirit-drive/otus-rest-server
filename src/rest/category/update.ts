import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { InternalServerError, ValidationError, ServerErrors, NotFoundError, NotAllowedError } from '../../Errors';
import { Category, CategoryUpdateInput, StandardParams } from '../../server.types';
import { updateModel } from '../helpers';
import { UserDocument } from '../../models/User';

export const update: (
  patch?: boolean
) => RequestHandler<StandardParams, Category | ServerErrors, CategoryUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { id } = req.params;
      const { commandId } = (req.user || {}) as UserDocument;
      const entity = await CategoryModel.findById(id);
      if (!entity) return res.status(404).json(new NotFoundError(`Category with id: "${id}" not found`));
      if (entity.commandId !== commandId) {
        return res.status(403).json(new NotAllowedError(`You can't edit this Category`));
      }
      updateModel(req.body, entity, ['name', 'photo'], patch);

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
