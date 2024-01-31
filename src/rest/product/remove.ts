import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProduct } from './prepareProduct';
import { InternalServerError, NotAllowedError, NotFoundError, ServerErrors } from '../../Errors';
import { Product, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Product | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await ProductModel.findById(id);
    if (!entity) return res.status(404).json(new NotFoundError(`Product with id: "${id}" not found`));
    if (entity.commandId !== commandId) {
      return res.status(403).json(new NotAllowedError(`You can't remove this Product`));
    }
    await entity.deleteOne();

    res.send(await prepareProduct(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
