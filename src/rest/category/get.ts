import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from './prepareCategory';
import { DataBaseError, ServerErrorJson } from '../../Errors';
import { Category, CategoryGetInput, StandardParams } from '../../server.types';

export const get: RequestHandler<StandardParams, Category | ServerErrorJson, CategoryGetInput> = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const entity = await CategoryModel.findOne({ $or: [{ _id: id }, { name: new RegExp(name, 'i') }] });

    res.send(await prepareCategory(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
