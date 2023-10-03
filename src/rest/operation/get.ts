import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperation } from './prepareOperation';
import { InternalServerError, NotFoundError, ServerErrors } from '../../Errors';
import { Operation, StandardParams } from '../../server.types';
import { UserDocument } from '../../models/User';

export const get: RequestHandler<StandardParams, Operation | ServerErrors> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { id } = req.params;
    const query = OperationModel.findOne({ _id: id });
    if (commandId) {
      query.where('commandId', commandId);
    }
    const entity = await query;

    if (!entity) return res.status(404).json(new NotFoundError(`Operation with id: "${id}" not found`));
    res.send(await prepareOperation(entity));
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
