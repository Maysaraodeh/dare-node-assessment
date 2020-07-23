import * as httpStatus from 'http-status-codes';

const FailureResponse = function FailureResponse(message, code) {
  this.success = false;
  this.message = message;
  this.code = code;
};

const SuccessResponse = function SuccessResponse(data, message) {
  if (data && typeof data === 'string') {
    message = data;
    data = null;
  }
  this.success = true;
  if (data) this.data = data;

  if (message) this.message = message;
  return this.data;
};

export default {
  ok: (response, data, message, root) =>
    response
      .status(httpStatus.OK)
      .json(new SuccessResponse(data, message, root)),
  badRequest: (response, message) =>
    response
      .status(httpStatus.BAD_REQUEST)
      .json(new FailureResponse(message, httpStatus.BAD_REQUEST)),
  notFound: (response, message) =>
    response
      .status(httpStatus.NOT_FOUND)
      .json(new FailureResponse(message, httpStatus.NOT_FOUND)),
  unAuthorized: (response, message) =>
    response
      .status(httpStatus.UNAUTHORIZED)
      .json(new FailureResponse(message, httpStatus.UNAUTHORIZED)),
  forbidden: (response, message) =>
    response
      .status(httpStatus.FORBIDDEN)
      .json(new FailureResponse(message, httpStatus.FORBIDDEN)),
  notAllowedMethod: (request, response, message) =>
    response
      .status(httpStatus.METHOD_NOT_ALLOWED)
      .json(
        new FailureResponse(
          message ||
            `The requested resource does not support http method '${request.method}'.'${request.path}'`,
          httpStatus.METHOD_NOT_ALLOWED
        )
      ),
  internalServerError: (next, error) => next(error),
};
