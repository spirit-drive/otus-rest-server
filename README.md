# Otus rest api сервер

С помощью этого сервера можно реализовать домашние работы и дипломный проект.

## API

### Основной url
http://19429ba06ff2.vps.myjino.ru/api

Все последующие пути добавляются к текущему

### Сущности
#### Category
```ts
type Category = {
  id: string;
  name: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
};
```
#### Order
```ts
type Order = {
  id: string;
  products: Product[];
  user: User;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

enum OrderStatus {
  PendingConfirmation = 'pending_confirmation',
  Processing = 'processing',
  Packaging = 'packaging',
  WaitingForDelivery = 'waiting_for_delivery',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  ReturnRequested = 'return_requested',
  OrderCancelled = 'order_cancelled',
}
```

#### Operation
```ts
type Cost = {
  id: string;
  name: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: Category;
  type: 'Cost';
};

type Profit = {
  id: string;
  name: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: Category;
  type: 'Profit';
};

type Operation = Profit | Cost;
```
#### Product
```ts
type Product = {
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
```

### Запросы не требующие токена

#### Авторизация

##### /signup POST
Регистрация нового пользователя

Параметры 
```ts
type SignUpBody = {
  email: string;
  password: string;
  commandId: string;
};
```
> При регистрации, нужно указать `commandId`, можно не явно.
Благодаря этому вы не будете видеть данных других команд, а они не будут видеть ваши данные.

Возвращает
```ts
type AuthResult = {
  token: string;
};
```

##### /signin POST
Авторизация пользователя

Параметры
```ts
type SignUpBody = {
  email: string;
  password: string;
};
```

Возвращает
```ts
type AuthResult = {
  token: string;
};
```

### Запросы требующие токен

Нужно добавить токен в заголовок **authorization** и добавить префикс: `Bearer ${token}`

#### Профиль
##### /profile GET
Возвращает данные профиля

Возвращает
```ts
export type Profile = {
  id: string;
  name: string;
  email: string;
  signUpDate: Date;
};
```
##### /profile POST | PUT | PATCH
Изменяет данные профиля. PATCH изменяет частично

Параметры
```ts
type UpdateProfileBody = {
  name: string;
};
```

Возвращает
```ts
export type Profile = {
  id: string;
  name: string;
  email: string;
  signUpDate: Date;
};
```
##### /profile/change-password POST
Изменяет пароль профиля

Параметры
```ts
type ChangePasswordBody = {
  password: string;
  newPassword: string;
};
```

Возвращает
```ts
type ChangePasswordResult = {
  success: boolean;
};
```

#### Категории
##### /categories GET
Запрос по фильтрам

Параметры
```ts
type Filters = {
  name?: string;
  ids?: string[];
};
```

Возвращает массив сущностей

##### /categories POST
Создает новую сущность

Параметры
```ts
type Params = {
  name: string;
  photo?: string;
};
```

Возвращает получившуюся сущность

##### /categories/:id GET
Возвращает по id

##### /categories/:id DELETE
Удаляет по id и возвращает

##### /categories/:id PUT
Обновляет по id и возвращает

Параметры
```ts
type Params = {
  name: string;
  photo?: string;
};
```

Возвращает получившуюся сущность

##### /categories/:id PATCH
Обновляет по id и возвращает.
Пустые параметры запроса не сбрасывают существующие данные

Параметры
```ts
type Params = {
  name?: string;
  photo?: string;
};
```

Возвращает получившуюся сущность

#### Продукты
##### /products GET
Запрос фильтрам

Параметры
```ts
type Filters = {
  name?: string;
  ids?: string[];
};
```

Возвращает массив сущностей

##### /products POST
Создает новую сущность

Параметры
```ts
type Params = {
  name: string;
  photo?: string;
  desc?: string;
  oldPrice?: number;
  price: number;
  categoryId: string;
};
```

Возвращает получившуюся сущность

##### /products/:id GET
Возвращает по id

##### /products/:id DELETE
Удаляет по id и возвращает

##### /products/:id PUT
Обновляет по id и возвращает

Параметры
```ts
type Params = {
  name: string;
  photo?: string;
  desc?: string;
  oldPrice?: number;
  price: number;
  categoryId: string;
};
```

Возвращает получившуюся сущность

##### /products/:id PATCH
Обновляет по id и возвращает.
Пустые параметры запроса не сбрасывают существующие данные

Параметры
```ts
type Params = {
  name?: string;
  photo?: string;
  desc?: string;
  oldPrice?: number;
  price?: number;
  categoryId?: string;
};
```

Возвращает получившуюся сущность

#### Операции
##### /operations GET
Запрос фильтрам

Параметры
```ts
type Filters = {
  name?: string;
  ids?: string[];
};
```

Возвращает массив сущностей

##### /operations POST
Создает новую сущность

Параметры
```ts
type Params = {
  name: string;
  desc?: string;
  amount: number;
  type: 'Profit' | 'Cost';
  categoryId: string;
};
```

Возвращает получившуюся сущность

##### /operations/:id GET
Возвращает по id

##### /operations/:id DELETE
Удаляет по id и возвращает

##### /operations/:id PUT
Обновляет по id и возвращает

Параметры
```ts
type Params = {
  name: string;
  desc?: string;
  amount: number;
  type: 'Profit' | 'Cost';
  categoryId: string;
};
```

Возвращает получившуюся сущность

##### /operations/:id PATCH
Обновляет по id и возвращает.
Пустые параметры запроса не сбрасывают существующие данные

Параметры
```ts
type Params = {
  name?: string;
  desc?: string;
  amount?: number;
  type?: 'Profit' | 'Cost';
  categoryId?: string;
};
```

Возвращает получившуюся сущность

#### Заказы
##### /orders GET
Запрос фильтрам

Параметры
```ts
type Filters = {
  productIds?: string[];
  userId?: string;
  ids?: string[];
};
```

Возвращает массив сущностей

##### /orders POST
Создает новую сущность

Параметры

```ts
type Params = {
  productIds: string[];
  userId: string; // Кто сделал заказ
  status?: OrderStatus;
};
```

Возвращает получившуюся сущность

##### /orders/:id GET
Возвращает по id

##### /orders/:id DELETE
Удаляет по id и возвращает

##### /orders/:id PUT
Обновляет по id и возвращает

Параметры
```ts
type Params = {
  productIds: string[];
  userId: string; // Кто сделал заказ
  status: OrderStatus;
};
```

Возвращает получившуюся сущность

##### /orders/:id PATCH
Обновляет по id и возвращает.
Пустые параметры запроса не сбрасывают существующие данные

Параметры
```ts
type Params = {
  productIds?: string[];
  userId?: string; // Кто сделал заказ
  status?: OrderStatus;
};
```

Возвращает получившуюся сущность

#### Файлы
##### /upload POST
Загружает файлы на сервер.

Возвращает

```json
{
  "url": "..."
}
```

#### Ошибки

Все ошибки с сервера приходят в формате
```ts
type ServerErrors = {
  errors: {
    extensions: {
      code: ErrorCode;
    };

    name: string;
    stack: string;
    message: string;
  }[];
}

enum ErrorCode {
  ERR_INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD',
  ERR_NOT_FOUND = 'ERR_NOT_FOUND',
  ERR_FIELD_REQUIRED = 'ERR_FIELD_REQUIRED',
  ERR_INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD',
  ERR_ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST',
  ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD',
  ERR_AUTH = 'ERR_AUTH',
  ERR_NO_FILES = 'ERR_NO_FILES',
  ERR_NOT_ALLOWED = 'ERR_NOT_ALLOWED',
  ERR_DATA_BASE_ERROR = 'ERR_DATA_BASE_ERROR',
  ERR_VALIDATION_ERROR = 'ERR_VALIDATION_ERROR',
}
```
