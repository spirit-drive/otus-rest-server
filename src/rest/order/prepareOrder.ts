import { OrderDocument } from '../../models/Order';
import { Order } from '../../server.types';
import { ProductModel } from '../../models/Product';
import { prepareProducts } from '../product/prepareProduct';
import { UserModel } from '../../models/User';
import { prepareUser } from '../../utils/prepareUser';

export const prepareOrder = async (item: OrderDocument): Promise<Order> => {
  if (!item) return null;
  const productDocs = await ProductModel.find({ _id: { $in: item.products.map((i) => i.id) } });
  const userDoc = await UserModel.findById(item.userId);
  return {
    id: item._id.toString(),
    products: await prepareProducts(productDocs),
    status: item.status,
    user: prepareUser(userDoc),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const prepareOrders = async (items: OrderDocument[]): Promise<Order[]> => {
  if (!items?.length) return [];

  const result: Order[] = [];
  for await (const item of items) {
    result.push(await prepareOrder(item));
  }
  return result;
};
