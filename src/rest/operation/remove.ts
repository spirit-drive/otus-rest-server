import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { InternalServerError, NotAllowedError, NotFoundError, ServerErrors } from '../../Errors';
import { Operation, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Operation | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await OperationModel.findById(id);
    if (!entity) return res.status(404).json(new NotFoundError(`Operation with id: "${id}" not found`));
    if (entity.commandId !== commandId) {
      return res.status(403).json(new NotAllowedError(`You can't remove this Operation`));
    }
    await entity.deleteOne();

    res.send(await prepareOperation(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
