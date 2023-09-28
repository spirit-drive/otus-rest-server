export type AuthResult = {
  token: string;
};

export type SignUpBody = {
  email: string;
  password: string;
  commandId: string;
};

export type SignInBody = {
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
  updatedAt: Date;
};

export type CategoryAddInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryUpdateInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryGetManyInput = Pick<Category, 'name'> & {
  ids: string[];
};

export type ProductAddInput = Omit<Product, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type ProductUpdateInput = Omit<Product, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type ProductGetManyInput = Pick<Product, 'name'> & {
  ids: string[];
};

export type OperationAddInput = Omit<Operation, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type OperationUpdateInput = Omit<Operation, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type OperationGetManyInput = Pick<Operation, 'name'> & {
  ids: string[];
};

export type OrderAddInput = Omit<Order, 'id' | 'createdAt' | 'products' | 'user' | 'updatedAt'> & {
  productIds: string[];
  userId: string;
};

export type OrderUpdateInput = Omit<Order, 'id' | 'createdAt' | 'products' | 'user' | 'updatedAt'> & {
  productIds: string[];
  userId: string;
};

export type OrderGetManyInput = {
  ids: string[];
  productIds: string[];
  userId: string;
  status: OrderStatus;
};

export type StandardParams = { id: string };

export type Product = {
  id: string;
  name: string;
  photo?: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  oldPrice?: number;
  price: number;
  category: Category;
};

export type Cost = {
  id: string;
  name: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: Category;
  type: 'Cost';
};

export type Profit = {
  id: string;
  name: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: Category;
  type: 'Profit';
};

export type Operation = Profit | Cost;

export enum OrderStatus {
  PendingConfirmation = 'pending_confirmation',
  Processing = 'processing',
  Packaging = 'packaging',
  WaitingForDelivery = 'waiting_for_delivery',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  ReturnRequested = 'return_requested',
  OrderCancelled = 'order_cancelled',
}

export type Order = {
  id: string;
  products: Product[];
  user: User;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};
