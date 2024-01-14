export type Pagination = {
  pageSize: number;
  pageNumber: number;
};

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum SortField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  date = 'date',
  name = 'name',
}

export type Sorting = {
  type: SortType;
  field: SortField;
};

export type ResponsePagination = Pagination & {
  total: number;
};

export type ResponseManyResult<T> = {
  data: T;
  sorting: Sorting;
  pagination: ResponsePagination;
};

export type AuthResult = {
  token: string;
  profile: Profile;
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
  ids?: string[];
  pagination?: Pagination;
  sorting?: Sorting;
  createdAt?: DateRange;
  updatedAt?: DateRange;
};

export type ProductAddInput = Omit<Product, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type ProductUpdateInput = Omit<Product, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type ProductGetManyInput = Pick<Product, 'name'> & {
  ids?: string[];
  pagination?: Pagination;
  sorting?: Sorting;
  createdAt?: DateRange;
  updatedAt?: DateRange;
};

export type OperationAddInput = Omit<Operation, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type OperationUpdateInput = Omit<Operation, 'id' | 'createdAt' | 'category' | 'updatedAt'> & {
  categoryId: string;
};

export type OperationGetManyInput = Pick<Operation, 'name' | 'type'> & {
  ids?: string[];
  pagination?: Pagination;
  sorting?: Sorting;
  type?: 'Cost' | 'Profit';
  createdAt?: DateRange;
  updatedAt?: DateRange;
  date?: DateRange;
};

export type ProductInput = {
  id: string;
  quantity: number;
};

export type OrderAddInput = Omit<Order, 'id' | 'createdAt' | 'products' | 'user' | 'updatedAt'> & {
  products: ProductInput[];
};

export type OrderUpdateInput = Omit<Order, 'id' | 'createdAt' | 'products' | 'user' | 'updatedAt'> & {
  products: ProductInput[];
};

export type OrderGetManyInput = {
  ids?: string[];
  productIds?: string[];
  userId?: string;
  status?: OrderStatus;
  pagination?: Pagination;
  sorting?: Sorting;
  createdAt?: DateRange;
  updatedAt?: DateRange;
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
  date: Date;
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
  date: Date;
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

export type OrderProduct = {
  _id: string;
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  products: OrderProduct[];
  user: User;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type DateRange = {
  gte?: string;
  lte?: string;
};
