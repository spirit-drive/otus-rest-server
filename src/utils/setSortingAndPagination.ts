import { QueryWithHelpers } from 'mongoose';
import { Pagination, SortField, Sorting, SortType } from '../server.types';
import * as config from '../config.json';

export const setSortingAndPagination = (
  query: QueryWithHelpers<unknown, unknown>,
  {
    sorting,
    pagination,
    defaultSortingField,
  }: { sorting: Sorting; pagination: Pagination; defaultSortingField: SortField }
) => {
  // Добавляем сортировку
  if (sorting) {
    const { type = SortType.ASC, field } = sorting;
    let sortField = defaultSortingField as string;

    switch (field) {
      case SortField.id:
        sortField = '_id';
        break;
      case SortField.createdAt:
        sortField = 'createdAt';
        break;
      case SortField.date:
        sortField = 'date';
        break;
      case SortField.updatedAt:
        sortField = 'updatedAt';
        break;
      case SortField.name:
        sortField = 'name';
        break;
      default:
        break;
    }

    const sortDirection = type === SortType.DESC ? -1 : 1;
    query.sort({ [sortField]: sortDirection });
  }

  // Добавляем пагинацию
  if (pagination) {
    const { pageSize = config.defaultPageSize, pageNumber = config.defaultPageNumber } = pagination;
    const skip = pageSize * (pageNumber - 1);
    query.skip(skip).limit(pageSize);
  }

  return {
    pagination: { pageSize: config.defaultPageSize, pageNumber: config.defaultPageNumber, ...(pagination || {}) },
    sorting: { type: SortType.ASC, field: defaultSortingField, ...(sorting || {}) },
  };
};
