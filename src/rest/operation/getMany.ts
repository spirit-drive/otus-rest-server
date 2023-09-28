import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperations } from './prepareOperation';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Operation, OperationGetManyInput, ResponseManyResult, SortField } from '../../server.types';
import { UserDocument } from '../../models/User';
import { setSortingAndPagination } from '../../utils/setSortingAndPagination';
import { getManyResponse } from '../../utils/getManyResponse';

export const getMany: RequestHandler<
  never,
  ResponseManyResult<Operation[]> | ServerErrors,
  OperationGetManyInput
> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { name, ids, pagination, sorting } = req.body;
    const query = OperationModel.find();
    if (commandId) {
      query.where('commandId', commandId);
    }
    if (ids?.length) {
      query.where('_id', { $in: ids });
    }
    if (name) {
      query.where('name', new RegExp(name, 'i'));
    }

    const responseSortingAndPagination = setSortingAndPagination(query, {
      sorting,
      pagination,
      defaultSortingField: SortField.createdAt,
    });

    const entities = await query;

    const countQuery = OperationModel.find();

    res.send(
      await getManyResponse(
        await prepareOperations(entities),
        query.getFilter(),
        countQuery,
        responseSortingAndPagination
      )
    );
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
