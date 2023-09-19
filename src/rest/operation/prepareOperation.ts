import { OperationDocument } from '../../models/Operation';
import { Operation } from '../../server.types';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from '../category/prepareCategory';

export const prepareOperation = async (item: OperationDocument): Promise<Operation> => {
  if (!item) return null;
  const category = await CategoryModel.findById(item.categoryId);
  return {
    id: item._id.toString(),
    name: item.name,
    desc: item.desc,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    type: item.type,
    amount: item.amount,
    category: await prepareCategory(category),
  };
};

export const prepareOperations = async (items: OperationDocument[]): Promise<Operation[]> => {
  if (!items?.length) return [];

  const result: Operation[] = [];
  for await (const item of items) {
    result.push(await prepareOperation(item));
  }
  return result;
};
