import { RequestHandler } from 'express-serve-static-core';
import { ProductModel } from '../../models/Product';
import { prepareProducts } from './prepareProduct';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Product, ProductGetManyInput, ResponseManyResult, SortField } from '../../server.types';
import { UserDocument } from '../../models/User';
import { setSortingAndPagination } from '../../utils/setSortingAndPagination';
import { getManyResponse } from '../../utils/getManyResponse';

export const getMany: RequestHandler<never, ResponseManyResult<Product[]> | ServerErrors, ProductGetManyInput> = async (
  req,
  res
) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { name, ids, sorting, pagination } = req.body;
    const query = ProductModel.find({ commandId });
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
    const countQuery = ProductModel.find();

    res.send(
      await getManyResponse(
        await prepareProducts(entities),
        query.getFilter(),
        countQuery,
        responseSortingAndPagination
      )
    );
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
