import { FilterQuery, QueryWithHelpers } from 'mongoose';
import { Pagination, ResponseManyResult, Sorting } from '../server.types';

export const getManyResponse = async <T>(
  data: T,
  filter: FilterQuery<unknown>,
  countQuery: QueryWithHelpers<unknown, unknown>,
  { sorting, pagination }: { pagination: Pagination; sorting: Sorting }
): Promise<ResponseManyResult<T>> => {
  countQuery.where(filter);

  return {
    data,
    sorting,
    pagination: {
      ...pagination,
      total: await countQuery.countDocuments(),
    },
  };
};
