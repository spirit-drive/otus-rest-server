import { RequestHandler } from 'express-serve-static-core';
import { OrderModel } from '../../models/Order';
import { prepareOrders } from './prepareOrder';
import { DataBaseError, ServerErrors } from '../../Errors';
import { Order, OrderGetManyInput, ResponseManyResult, SortField } from '../../server.types';
import { UserDocument } from '../../models/User';
import { setSortingAndPagination } from '../../utils/setSortingAndPagination';
import { getManyResponse } from '../../utils/getManyResponse';

export const getMany: RequestHandler<never, ResponseManyResult<Order[]> | ServerErrors, OrderGetManyInput> = async (
  req,
  res
) => {
  try {
    const { commandId } = (req.user || {}) as UserDocument;
    const { ids, userId, productIds, status, sorting, pagination } = req.body;
    const query = OrderModel.find();
    if (commandId) {
      query.where('commandId', commandId);
    }
    if (ids?.length) {
      query.where('_id', { $in: ids });
    }
    if (userId) {
      query.where('userId', userId);
    }
    if (status) {
      query.where('status', status);
    }
    if (productIds?.length) {
      query.where('productIds').in(productIds);
    }

    const responseSortingAndPagination = setSortingAndPagination(query, {
      sorting,
      pagination,
      defaultSortingField: SortField.createdAt,
    });

    const entities = await query;

    const countQuery = OrderModel.find();

    res.send(
      await getManyResponse(await prepareOrders(entities), query.getFilter(), countQuery, responseSortingAndPagination)
    );
  } catch (e) {
    res.status(500).json(new DataBaseError(e));
  }
};
