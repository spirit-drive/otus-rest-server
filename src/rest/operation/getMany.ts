import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperations } from './prepareOperation';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Operation, OperationGetManyInput } from '../../server.types';

export const getMany: RequestHandler<never, Operation[] | ServerErrors, OperationGetManyInput> = async (req, res) => {
  try {
    const { name, ids } = req.body;
    const query = OperationModel.find();
    if (ids?.length) {
      query.where('_id', { $in: ids });
    } else if (name) {
      query.where('name', new RegExp(name, 'i'));
    }
    const entities = await query;

    res.send(await prepareOperations(entities));
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
