export class ClientsError extends Error {
  constructor(message, code) {
    super(message, code);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PoliciesError extends Error {
  constructor(message, code) {
    super(message, code);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RemoteAPIError extends Error {
  constructor(message, code) {
    super(message, code);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
