import { Error } from 'mongoose';

enum ErrorCode {
  ERR_INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD',
  ERR_NOT_FOUND = 'ERR_NOT_FOUND',
  ERR_INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD',
  ERR_ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST',
  ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD',
  ERR_AUTH = 'ERR_AUTH',
  ERR_DATA_BASE_ERROR = 'ERR_DATA_BASE_ERROR',
  ERR_VALIDATION_ERROR = 'ERR_VALIDATION_ERROR',
}

export type ServerError = Error & {
  extensions: {
    code: ErrorCode;
  };
};

export interface ServerErrorJson {
  error: ServerError;
}
export class DataBaseError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_DATA_BASE_ERROR,
    };
  }
}

export class ValidationError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_VALIDATION_ERROR,
    };
  }
}

export class AuthError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_AUTH,
    };
  }
}

export class IncorrectEmailOrPasswordError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_INCORRECT_EMAIL_OR_PASSWORD,
    };
  }
}

export class IncorrectPasswordError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_INCORRECT_PASSWORD,
    };
  }
}

export class AccountAlreadyExistError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_ACCOUNT_ALREADY_EXIST,
    };
  }
}

export class InvalidPasswordError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_INVALID_PASSWORD,
    };
  }
}

export class NotFoundError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    this.error = (message instanceof Error ? message : new Error(message)) as ServerError;
    this.error.extensions = {
      code: ErrorCode.ERR_NOT_FOUND,
    };
  }
}
