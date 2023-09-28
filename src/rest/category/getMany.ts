import { RequestHandler } from 'express-serve-static-core';
import { CategoryModel } from '../../models/Category';
import { prepareCategories } from './prepareCategory';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Category, CategoryGetManyInput, ResponseManyResult, SortField } from '../../server.types';
import { UserDocument } from '../../models/User';
import { setSortingAndPagination } from '../../utils/setSortingAndPagination';
import { getManyResponse } from '../../utils/getManyResponse';

export const getMany: RequestHandler<
  never,
  ResponseManyResult<Category[]> | ServerErrors,
  CategoryGetManyInput
> = async (req, res) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { name, ids, sorting, pagination } = req.body;
    const query = CategoryModel.find({ commandId });
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
    res.status(500).json(new DataBaseError(e));
  }
};
