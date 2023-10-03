import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategories } from './prepareCategory';
import { InternalServerError, InvalidQueryParamsError, ServerErrors } from '../../Errors';
import { Category, CategoryGetManyInput, ResponseManyResult, SortField } from '../../server.types';
import { UserDocument } from '../../models/User';
import { setSortingAndPagination } from '../../utils/setSortingAndPagination';
import { getManyResponse } from '../../utils/getManyResponse';
import { parseQuery } from '../../utils/parseQuery';

export const getMany: RequestHandler<never, ResponseManyResult<Category[]> | ServerErrors> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    let params;
    try {
      params = parseQuery<CategoryGetManyInput>(req.query);
    } catch (e) {
      return res.status(400).json(new InvalidQueryParamsError(e));
    }
    const { name, ids, sorting, pagination, createdAt, updatedAt } = params;
    const query = CategoryModel.find();
    if (commandId) {
      query.where('commandId', commandId);
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
    if (ids?.length) {
      query.where('_id', { $in: ids });
    }
    if (name) {
      query.where('name', new RegExp(name, 'i'));
    }

    const responseSortingAndPagination = setSortingAndPagination(query, {
      sorting,
      pagination,
      defaultSortingField: SortField.name,
    });

    const entities = await query;

    const countQuery = CategoryModel.find();
    res.send(
      await getManyResponse(
        await prepareCategories(entities),
        query.getFilter(),
        countQuery,
        responseSortingAndPagination
      )
    );
  } catch (e) {
    res.status(500).json(new InternalServerError(e));
  }
};
