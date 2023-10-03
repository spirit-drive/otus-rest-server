import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { InternalServerError, NotFoundError, ServerErrors } from '../../Errors';
import { Category, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Category | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await CategoryModel.findOneAndRemove({ _id: id, commandId });

    if (!entity) return res.status(404).json(new NotFoundError(`Category with id: "${id}" not found`));
    res.send(await prepareCategory(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
