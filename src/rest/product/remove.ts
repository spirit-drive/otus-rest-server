import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { DataBaseError, NotFoundError, ServerErrors } from '../../Errors';
import { Product, StandardParams } from '../../server.types';

export const remove: RequestHandler<StandardParams, Product | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await ProductModel.findByIdAndRemove(id);

    if (!entity) return res.status(500).json(new NotFoundError(`Product with id: "${id}" not found`));
    res.send(await prepareProduct(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
