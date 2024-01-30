import { RequestHandler } from 'express-serve-static-core';
import { OperationModel } from '../../models/Operation';
import { prepareOperations } from './prepareOperation';
import { InternalServerError, InvalidQueryParamsError, ServerErrors } from '../../Errors';
import { Operation, OperationGetManyInput, ResponseManyResult, SortField } from '../../server.types';
import { UserDocument } from '../../models/User';
import { setSortingAndPagination } from '../../utils/setSortingAndPagination';
import { getManyResponse } from '../../utils/getManyResponse';
import { parseQuery } from '../../utils/parseQuery';

export const getMany: RequestHandler<
  never,
  ResponseManyResult<Operation[]> | ServerErrors,
  OperationGetManyInput
> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    let params;
    try {
      params = parseQuery<OperationGetManyInput>(req.query);
    } catch (e) {
      return res.status(400).json(new InvalidQueryParamsError(e));
    }
    const { name, categoryIds, ids, pagination, sorting, type, createdAt, date, updatedAt } = params;

    const query = OperationModel.find();
    if (commandId) {
      query.where('commandId', commandId);
    }
    if (date && (date.gte || date.lte)) {
      query.where('date');
      if (date.gte) {
        query.gte(new Date(date.gte).getTime());
      }
      if (date.lte) {
        query.lte(new Date(date.lte).getTime());
      }
    }
    if (createdAt && (createdAt.gte || createdAt.lte)) {
      query.where('createdAt');
      if (createdAt.gte) {
        query.gte(new Date(createdAt.gte).getTime());
      }
      if (createdAt.lte) {
        query.lte(new Date(createdAt.lte).getTime());
      }
    }
    if (updatedAt && (updatedAt.gte || updatedAt.lte)) {
      query.where('updatedAt');
      if (updatedAt.gte) {
        query.gte(new Date(updatedAt.gte).getTime());
      }
      if (updatedAt.lte) {
        query.lte(new Date(updatedAt.lte).getTime());
      }
    }
    if (type) {
      query.where('type', type);
    }
    if (ids?.length) {
      query.where('_id', { $in: ids });
    }
    if (categoryIds?.length) {
      query.where('categoryId', { $in: categoryIds });
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
    res.status(500).json(new InternalServerError(e));
  }
};
