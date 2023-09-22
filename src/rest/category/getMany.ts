import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategories } from './prepareCategory';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Category, CategoryGetManyInput } from '../../server.types';
import { UserDocument } from '../../models/User';

export const getMany: RequestHandler<never, Category[] | ServerErrors, CategoryGetManyInput> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { name, ids } = req.body;
    const query = CategoryModel.find({ commandId });
    if (ids?.length) {
      query.where('_id', { $in: ids });
    } else if (name) {
      query.where('name', new RegExp(name, 'i'));
    }
    const entities = await query;

    res.send(await prepareCategories(entities));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
