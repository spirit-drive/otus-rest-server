export type AuthResult = {
  token: string;
};

export type SignBody = {
  email: string;
  password: string;
};

export type ChangePasswordBody = {
  password: string;
  newPassword: string;
};

export type ChangePasswordResult = {
  success: boolean;
};

export type UpdateProfileBody = {
  name: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  signUpDate: unknown;
};

export type User = Omit<Profile, 'email' | 'signUpDate'>;

export type Category = {
  id: string;
  name: string;
  photo?: string;
  createdAt: Date;
};

export type CategoryAddInput = Omit<Category, 'id' | 'createdAt'>;
export type CategoryUpdateInput = Omit<Category, 'createdAt' | 'id'>;
export type CategoryGetManyInput = Pick<Category, 'name'> & {
  ids: string[];
};

export type ProductAddInput = Omit<Product, 'id' | 'createdAt' | 'category'> & {
  categoryId: string;
};

export type ProductUpdateInput = Omit<Product, 'id' | 'createdAt' | 'category'> & {
  categoryId: string;
};

export type ProductGetManyInput = Pick<Product, 'name'> & {
  ids: string[];
};

export type StandardParams = { id: string };

export type Product = {
  id: string;
  name: string;
  photo?: string;
  desc?: string;
  createdAt: Date;
  oldPrice?: number;
  price: number;
  category: Category;
};

export type Cost = {
  id: string;
  name: string;
  desc?: string;
  createdAt: Date;
  amount: number;
  category: Category;
  type: 'Cost';
};

export type Profit = {
  id: string;
  name: string;
  desc?: string;
  createdAt: Date;
  amount: number;
  category: Category;
  type: 'Profit';
};

export type Operation = Profit | Cost;

export type Order = {
  id: string;
  products: Product[];
  createdAt: Date;
};
