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
  products: OrderProduct[];
  user: User;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

type OrderProduct = {
  id: string;
  product: Product;
  quantity: number;
}

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

#### Дополнительные типы
```ts
export type Pagination = {
  pageSize: number;
  pageNumber: number;
};

export type Sorting = {
  type: 'ASC' | 'DESC';
  field: 'id' | 'createdAt' | 'updatedAt' | 'name';
};
```


### Работа с токеном

Некоторые запросы открытые, другие - защищенные (**PROTECTED**)

Для отправки защищенных запросов нужно добавить токен в заголовок **authorization** и добавить префикс: `Bearer ${token}`

Токен можно получить при авторизации и необходимо его сохранять локально.


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

#### Профиль
##### /profile GET **PROTECTED**
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
##### /profile POST | PUT | PATCH **PROTECTED**
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
##### /profile/change-password POST **PROTECTED**

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

#### Категории (Общее)
##### /categories GET
Запрос по фильтрам. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

Параметры
```ts
type Filters = {
  name?: string;
  ids?: string[];
  pagination?: Pagination;
  sorting?: Sorting;
};
```

Возвращает

```ts
{
  data: Category[];
  pagination: {
    pageSize: number;
    pageNumber: number;
    total: number;
  };
  sorting: {
    type: 'ASC' | 'DESC';
    field: 'id' | 'createdAt' | 'updatedAt' | 'name';
  }
}
```

##### /categories POST **PROTECTED**
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
Возвращает по id.  Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

##### /categories/:id DELETE **PROTECTED**
Удаляет по id и возвращает

##### /categories/:id PUT **PROTECTED**
Обновляет по id и возвращает

Параметры
```ts
type Params = {
  name: string;
  photo?: string;
};
```

Возвращает получившуюся сущность

##### /categories/:id PATCH **PROTECTED**
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

#### Продукты (Интернет-магазин)
##### /products GET
Запрос фильтрам. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

Параметры
```ts
type Filters = {
  name?: string;
  ids?: string[];
  pagination?: Pagination;
  sorting?: Sorting;
};
```

Возвращает 

```ts
{
  data: Product[];
  pagination: {
    pageSize: number;
    pageNumber: number;
    total: number;
  };
  sorting: {
    type: 'ASC' | 'DESC';
    field: 'id' | 'createdAt' | 'updatedAt' | 'name';
  }
}
```

##### /products POST **PROTECTED**
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
Возвращает по id. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

##### /products/:id DELETE **PROTECTED**
Удаляет по id и возвращает

##### /products/:id PUT **PROTECTED**
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

##### /products/:id PATCH **PROTECTED**
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

#### Заказы (Интернет-магазин)
##### /orders GET
Запрос фильтрам. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

Параметры
```ts
type Filters = {
  productIds?: string[];
  userId?: string;
  ids?: string[];
  status?: OrderStatus;
  pagination?: Pagination;
  sorting?: Sorting;
};
```

Возвращает

```ts
{
  data: Order[];
  pagination: {
    pageSize: number;
    pageNumber: number;
    total: number;
  };
  sorting: {
    type: 'ASC' | 'DESC';
    field: 'id' | 'createdAt' | 'updatedAt' | 'name';
  }
}
```

##### /orders POST **PROTECTED**
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
Возвращает по id. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

##### /orders/:id DELETE **PROTECTED**
Удаляет по id и возвращает

##### /orders/:id PUT **PROTECTED**
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

##### /orders/:id PATCH **PROTECTED**
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

#### Операции (Учет доходов/расходов)
##### /operations GET
Запрос фильтрам. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

Параметры
```ts
type Filters = {
  name?: string;
  ids?: string[];
  pagination?: Pagination;
  sorting?: Sorting;
};
```

Возвращает 

```ts
{
  data: Operation[];
  pagination: {
    pageSize: number;
    pageNumber: number;
    total: number;
  };
  sorting: {
    type: 'ASC' | 'DESC';
    field: 'id' | 'createdAt' | 'updatedAt' | 'name';
  }
}
```

##### /operations POST **PROTECTED**
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
Возвращает по id. Авторизация не обязательна, но с ней вы будете видеть только свои данные, а не всех учеников

##### /operations/:id DELETE **PROTECTED**
Удаляет по id и возвращает

##### /operations/:id PUT **PROTECTED**
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

##### /operations/:id PATCH **PROTECTED**
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

#### Файлы (Общее)
##### /upload POST **PROTECTED**
Загружает файлы на сервер.

Возвращает

```json
{
  "url": "..."
}
```

###### Пример выгрузки изображения на сервер с помощью fetch
```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const [file] = e.target.files;
  const body = new FormData();
  // важно использовать название file append('file', ...) иначе работать не будет
  body.append('file', file);
  fetch('http://19429ba06ff2.vps.myjino.ru/api/upload', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
    body,
  })
    .then(res => res.json())
    .then(({ url }) => onChange(url))
    .catch((err) => {
      console.error(err);
    })
};

...

<input type="file" onChange={handleChange} />
```

###### Пример выгрузки изображения на сервер с помощью XMLHttpRequest
```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const [file] = e.target.files;
  const body = new FormData();
  // важно использовать название file append('file', ...) иначе работать не будет
  body.append('file', file);
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
      // Здесь можно получать количество отправленных данных на сервер, что позволяет сделать индикатор загрузки изображения  
      onProgress(event.loaded, event.total);
    };
    xhr.onload = function () {
      if (xhr.status !== 200) {
        reject(xhr);
      } else {
        resolve(JSON.parse(xhr.response));
      }
    };

    xhr.onerror = () => {
      Object.assign(xhr, { message: 'unknown error' });
      reject(xhr);
    };

    xhr.open('POST', 'http://19429ba06ff2.vps.myjino.ru/api/upload');

    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.send(body);
  })
    .then(({ url }) => onChange(url))
    .catch((err) => {
      console.error(err);
    })
};

...

<input type="file" onChange={handleChange} />
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
    fieldName?: string; // Существует при ошибке с кодом ERR_FIELD_REQUIRED
    stack: string;
    message: string;
  }[];
}

enum ErrorCode {
  ERR_INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD', // Если не корректный email или пароль
  ERR_ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST', // При регистрации если пользователь уже существует
  ERR_FIELD_REQUIRED = 'ERR_FIELD_REQUIRED', // Обязательное поле. В ошибке будет дополнительное поле fieldName с указанием, какое конкретно поле обязательно
  ERR_INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD', // Некорректный старый пароль при попытке его изменить
  ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD', // Пароль не соответствует регулярному выражению /^[\w-@{}()#$%^&*+=!~]{8,}$/
  ERR_AUTH = 'ERR_AUTH', // Токен не передан, либо не прошел авторизацию
  ERR_NO_FILES = 'ERR_NO_FILES', // Ошибка при загрузке файлов
  ERR_NOT_ALLOWED = 'ERR_NOT_ALLOWED', // Нет доступа к данной операции (нельзя редактировать заказ другого пользователя)
  ERR_NOT_FOUND = 'ERR_NOT_FOUND', // Сущность не найдена
  ERR_VALIDATION_ERROR = 'ERR_VALIDATION_ERROR', // Не валидные данные, например, не указано name
  
  ERR_DATA_BASE_ERROR = 'ERR_DATA_BASE_ERROR', // Обратитесь ко мне, этой ошибки быть не должно
}
```
