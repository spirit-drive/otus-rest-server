import { ProductModel } from '../../models/Product';

export const isExistProducts = async (productIds: string[]): Promise<boolean> => {
  for await (const id of productIds) {
    const product = await ProductModel.findById(id);
    if (!product) return false;
  }
  return true;
};
