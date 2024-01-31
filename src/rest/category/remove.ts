import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { InternalServerError, NotAllowedError, NotFoundError, ServerErrors } from '../../Errors';
import { Category, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Category | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await CategoryModel.findById(id);
    if (!entity) return res.status(404).json(new NotFoundError(`Category with id: "${id}" not found`));
    if (entity.commandId !== commandId) {
      return res.status(403).json(new NotAllowedError(`You can't remove this Category`));
    }
    await entity.deleteOne();

    res.send(await prepareCategory(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
