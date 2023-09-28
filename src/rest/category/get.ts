import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { DataBaseError, NotFoundError, ServerErrors } from '../../Errors';
import { Category, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const get: RequestHandler<StandardParams, Category | ServerErrors> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { id } = req.params;
    const query = CategoryModel.findOne({ _id: id });
    if (commandId) {
      query.where('commandId', commandId);
    }
    const entity = await query;

    if (!entity) return res.status(404).json(new NotFoundError(`Category with id: "${id}" not found`));
    res.send(await prepareCategory(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
