import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { DataBaseError, ServerErrorJson } from '../../Errors';
import { Product, StandardParams } from '../../server.types';

export const get: RequestHandler<StandardParams, Product | ServerErrorJson> = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await ProductModel.findById(id);

    res.send(await prepareProduct(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
