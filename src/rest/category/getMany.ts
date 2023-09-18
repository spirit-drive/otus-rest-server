import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategories } from './prepareCategory';
import { DataBaseError, ServerErrorJson } from '../../Errors';
import { Category, CategoryGetManyInput } from '../../server.types';

export const getMany: RequestHandler<never, Category[] | ServerErrorJson, CategoryGetManyInput> = async (req, res) => {
  try {
    const { name, ids } = req.body;
    const query = CategoryModel.find();
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
