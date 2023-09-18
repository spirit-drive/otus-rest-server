import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { DataBaseError, ServerErrorJson } from '../../Errors';
import { Category, StandardParams } from '../../server.types';

export const remove: RequestHandler<StandardParams, Category | ServerErrorJson> = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await CategoryModel.findByIdAndRemove(id);

    res.send(await prepareCategory(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
