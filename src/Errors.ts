import { Error } from 'mongoose';

enum ErrorCode {
  ERR_INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD',
  ERR_NOT_FOUND = 'ERR_NOT_FOUND',
  ERR_FIELD_REQUIRED = 'ERR_FIELD_REQUIRED',
  ERR_NOT_VALID = 'ERR_NOT_VALID',
  ERR_INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD',
  ERR_ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST',
  ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD',
  ERR_AUTH = 'ERR_AUTH',
  ERR_NO_FILES = 'ERR_NO_FILES',
  ERR_NOT_ALLOWED = 'ERR_NOT_ALLOWED',
  ERR_INTERNAL_SERVER = 'ERR_INTERNAL_SERVER',
  ERR_INVALID_QUERY_PARAMS = 'ERR_INVALID_QUERY_PARAMS',
  ERR_VALIDATION_ERROR = 'ERR_VALIDATION_ERROR',
}

export class ServerError {
  extensions: {
    code: ErrorCode;
  };

  name: string;
  fieldName: string;
  stack: string;
  message: string;

  constructor(message: string | Error, code: ErrorCode, name: string, fieldName?: string) {
    const error = message instanceof Error ? message : new Error(message);

    this.name = name || error.name;
    if (fieldName) {
      this.fieldName = fieldName;
    }
    this.stack = error.stack;
    this.message = error.message;
    this.extensions = { code };
  }
}

export class ServerErrors {
  errors: ServerError[];

  constructor(message: string | Error, code: ErrorCode, name: string, fieldName?: string) {
    const error = message instanceof Error ? message : new Error(message);
    this.errors = [];

    if ('errors' in error && error.errors && typeof error.errors === 'object') {
      Object.keys(error.errors).forEach((key) => {
        this.errors.push(new ServerError((error.errors as Record<string, Error>)[key], code, name, fieldName));
      });
    } else {
      this.errors.push(new ServerError(error, code, name, fieldName));
    }
  }
}

export class InternalServerError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_INTERNAL_SERVER, 'InternalServerError', fieldName);
  }
}

export class ValidationError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_VALIDATION_ERROR, 'ValidationError', fieldName);
  }
}

export class AuthError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_AUTH, 'AuthError', fieldName);
  }
}

export class IncorrectEmailOrPasswordError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_INCORRECT_EMAIL_OR_PASSWORD, 'IncorrectEmailOrPasswordError', fieldName);
  }
}

export class IncorrectPasswordError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_INCORRECT_PASSWORD, 'IncorrectPasswordError', fieldName);
  }
}

export class AccountAlreadyExistError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_ACCOUNT_ALREADY_EXIST, 'AccountAlreadyExistError', fieldName);
  }
}

export class InvalidPasswordError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_INVALID_PASSWORD, 'InvalidPasswordError', fieldName);
  }
}

export class NotFoundError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_NOT_FOUND, 'NotFoundError', fieldName);
  }
}
export class FieldRequiredError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_FIELD_REQUIRED, 'FieldRequiredError', fieldName);
  }
}
export class NotValidIdError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_NOT_VALID, 'NotValidIdError', fieldName);
  }
}
export class NotAllowedError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_NOT_ALLOWED, 'NotAllowedError', fieldName);
  }
}
export class NoFilesError extends ServerErrors {
  constructor(message: string | Error, fieldName?: string) {
    super(message, ErrorCode.ERR_NO_FILES, 'NoFilesError', fieldName);
  }
}
export class InvalidQueryParamsError extends ServerErrors {
  constructor(message: string | Error) {
    const key =
      message && typeof message === 'object' && 'key' in message
        ? (message as unknown as { key: string }).key
        : undefined;
    super(
      Object.assign(message, { message: `"${key}" value is not valid json` }),
      ErrorCode.ERR_INVALID_QUERY_PARAMS,
      'InvalidQueryParamsError'
    );
  }
}
