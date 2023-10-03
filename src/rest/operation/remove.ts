import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { InternalServerError, NotFoundError, ServerErrors } from '../../Errors';
import { Operation, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const remove: RequestHandler<StandardParams, Operation | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandId } = (req.user || {}) as UserDocument;
    const entity = await OperationModel.findOneAndRemove({ _id: id, commandId });

    if (!entity) return res.status(404).json(new NotFoundError(`Operation with id: "${id}" not found`));
    res.send(await prepareOperation(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
