import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProducts } from './prepareProduct';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Product, ProductGetManyInput } from '../../server.types';

export const getMany: RequestHandler<never, Product[] | ServerErrors, ProductGetManyInput> = async (req, res) => {
  try {
    const { name, ids } = req.body;
    const query = ProductModel.find();
    if (ids?.length) {
      query.where('_id', { $in: ids });
    } else if (name) {
      query.where('name', new RegExp(name, 'i'));
    }
    const entities = await query;

    res.send(await prepareProducts(entities));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
