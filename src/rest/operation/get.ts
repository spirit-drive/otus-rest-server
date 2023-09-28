import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { DataBaseError, NotFoundError, ServerErrors } from '../../Errors';
import { Operation, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const get: RequestHandler<StandardParams, Operation | ServerErrors> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { id } = req.params;
    const entity = await OperationModel.findOne({ _id: id, commandId });

    if (!entity) return res.status(404).json(new NotFoundError(`Operation with id: "${id}" not found`));
    res.send(await prepareOperation(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
