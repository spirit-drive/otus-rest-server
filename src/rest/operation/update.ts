import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { DataBaseError, ValidationError, ServerErrors } from '../../Errors';
import { Operation, OperationUpdateInput, StandardParams } from '../../server.types';
import { updateModel } from '../helpers';

export const update: (
  patch?: boolean
) => RequestHandler<StandardParams, Operation | ServerErrors, OperationUpdateInput> =
  (patch?: boolean) => async (req, res) => {
    try {
      const { id } = req.params;
      const entity = await OperationModel.findById(id);
      updateModel(req.body, entity, ['name', 'type', 'categoryId', 'desc', 'amount'], patch);

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
      res.status(500).json(new DataBaseError(e));
    }
  };
