import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { InternalServerError, ValidationError, ServerErrors, NotFoundError } from '../../Errors';
import { Operation, OperationUpdateInput, StandardParams } from '../../server.types';
import { updateModel } from '../helpers';
import { CategoryModel } from '../../models/Category';
import { UserDocument } from '../../models/User';

export const update: (
  patch?: boolean
) => RequestHandler<StandardParams, Operation | ServerErrors, OperationUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { id } = req.params;
      const { commandId } = (req.user || {}) as UserDocument;
      const entity = await OperationModel.findOne({ _id: id, commandId });
      if (!entity) return res.status(404).json(new NotFoundError(`Operation with id: "${id}" not found`));
      updateModel(req.body, entity, ['name', 'type', 'categoryId', 'desc', 'amount'], patch);
      if (!(await CategoryModel.findById(entity.categoryId))) {
        return res.status(400).json(new NotFoundError(`category not found`, 'categoryId'));
      }

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
