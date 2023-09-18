import { Error } from 'mongoose';

enum ErrorCode {
  ERR_INCORRECT_EMAIL_OR_PASSWORD = 'ERR_INCORRECT_EMAIL_OR_PASSWORD',
  ERR_NOT_FOUND = 'ERR_NOT_FOUND',
  ERR_INCORRECT_PASSWORD = 'ERR_INCORRECT_PASSWORD',
  ERR_ACCOUNT_ALREADY_EXIST = 'ERR_ACCOUNT_ALREADY_EXIST',
  ERR_INVALID_PASSWORD = 'ERR_INVALID_PASSWORD',
  ERR_AUTH = 'ERR_AUTH',
  ERR_DATA_BASE_ERROR = 'ERR_DATA_BASE_ERROR',
  ERR_INVALID_NICKNAME = 'ERR_INVALID_NICKNAME',
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
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_DATA_BASE_ERROR,
    };
  }
}

export class InvalidNickNameError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_INVALID_NICKNAME,
    };
  }
}

export class AuthError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_AUTH,
    };
  }
}

export class IncorrectEmailOrPasswordError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_INCORRECT_EMAIL_OR_PASSWORD,
    };
  }
}

export class IncorrectPasswordError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_INCORRECT_PASSWORD,
    };
  }
}

export class AccountAlreadyExistError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_ACCOUNT_ALREADY_EXIST,
    };
  }
}

export class InvalidPasswordError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_INVALID_PASSWORD,
    };
  }
}

export class NotFoundError implements ServerErrorJson {
  error: ServerError;

  constructor(message: string | Error) {
    Object.assign(this.error, message instanceof Error ? message : new Error(message));
    this.error.extensions = {
      code: ErrorCode.ERR_NOT_FOUND,
    };
  }
}
