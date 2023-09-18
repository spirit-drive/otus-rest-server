import { ParamsDictionary, RequestHandler } from 'express-serve-static-core';
import { Profile } from '../../server.types';
import { UserDocument } from '../../models/User';
import { prepareProfile } from './prepareProfile';
import { DataBaseError, ValidationError, ServerErrorJson } from '../../Errors';

export const update: (patch?: boolean) => RequestHandler<ParamsDictionary, Profile | ServerErrorJson> =
  (patch?: boolean) => async (req, res) => {
    try {
      const user = req.user as UserDocument;
      const { name } = req.body;
      user.name = patch ? name || user.name : name;

      // Выполняем валидацию перед сохранением
      const validationError = user.validateSync();
      if (validationError) {
        // Если есть ошибки валидации, отправляем ValidationError
        res.status(400).json(new ValidationError(validationError.message));
      } else {
        // Если валидация успешна, сохраняем документ
        await user.save();
        res.send(prepareProfile(user));
      }
    } catch (e) {
      res.status(500).json(new DataBaseError(e));
    }
  };
