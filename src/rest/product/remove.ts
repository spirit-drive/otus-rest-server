import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { InternalServerError, NotFoundError, ServerErrors } from '../../Errors';
import { Product, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Product | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await ProductModel.findOneAndRemove({ _id: id, commandId });

    if (!entity) return res.status(404).json(new NotFoundError(`Product with id: "${id}" not found`));
    res.send(await prepareProduct(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
