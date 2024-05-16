import { ProductDocument } from '../../models/Product';
import { Product } from '../../server.types';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from '../category/prepareCategory';

export const prepareProduct = async (item: ProductDocument): Promise<Product> => {
  if (!item) return null;
  const category = await CategoryModel.findById(item.categoryId);
  return {
    id: item._id.toString(),
    name: item.name,
    photo: item.photo,
    desc: item.desc,
    createdAt: item.createdAt,
    oldPrice: item.oldPrice,
    price: item.price,
    updatedAt: item.updatedAt,
    commandId: item.commandId,
    category: await prepareCategory(category),
  };
};

export const prepareProducts = async (items: ProductDocument[]): Promise<Product[]> => {
  if (!items?.length) return [];

  const result: Product[] = [];
  for await (const item of items) {
    result.push(await prepareProduct(item));
  }
  return result;
};
