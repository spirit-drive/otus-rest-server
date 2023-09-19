import { RequestHandler } from 'express-serve-static-core';
import { Profile } from '../../server.types';
import { UserDocument } from '../../models/User';
import { prepareProfile } from './prepareProfile';
import { DataBaseError, ValidationError, ServerErrors } from '../../Errors';

export const update: (patch?: boolean) => RequestHandler<never, Profile | ServerErrors> =
  (patch?: boolean) => async (req, res) => {
    try {
      const user = req.user as UserDocument;
      const { name } = req.body;
      user.name = patch ? name || user.name : name;

      // Выполняем валидацию перед сохранением
      const validationError = user.validateSync();
      if (validationError) {
        // Если есть ошибки валидации, отправляем ValidationError
        return res.status(400).json(new ValidationError(validationError));
      }
      // Если валидация успешна, сохраняем документ
      await user.save();
      res.send(prepareProfile(user));
    } catch (e) {
      res.status(500).json(new DataBaseError(e));
    }
  };
