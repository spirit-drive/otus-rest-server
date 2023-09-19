import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { DataBaseError, NotFoundError, ServerErrors } from '../../Errors';
import { Operation, StandardParams } from '../../server.types';

export const remove: RequestHandler<StandardParams, Operation | ServerErrors> = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await OperationModel.findByIdAndRemove(id);

    if (!entity) return res.status(500).json(new NotFoundError(`Operation with id: "${id}" not found`));
    res.send(await prepareOperation(entity));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
