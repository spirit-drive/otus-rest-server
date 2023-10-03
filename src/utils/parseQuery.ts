import { Query } from 'express-serve-static-core';

export const parseQuery = <T extends Record<string, unknown>>(query: Query): T => {
  const result: T = {} as T;
  Object.keys(query).forEach((key: keyof T) => {
    try {
      result[key] = JSON.parse(query[key as keyof Query] as string);
    } catch (e) {
      e.key = key;
      throw e;
    }
  });
  return result;
};
