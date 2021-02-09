import * as httpStatus from 'http-status-codes';

const FailureResponse = function FailureResponse(message, code) {
  this.success = false;
  this.message = message;
  this.code = code;
};

const SuccessResponse = function SuccessResponse(data, message) {
  let successMessage = message;
  let successData = data;
  if (data && typeof data === 'string') {
    successMessage = data;
    successData = null;
  }
  this.success = true;
  if (successData) this.data = successData;

  if (successMessage) this.message = successMessage;
  return this.data;
};

export default {
  ok: (response, data, message, root) =>
    response.status(httpStatus.OK).json(new SuccessResponse(data, message, root)),
  badRequest: (response, message) =>
    response
      .status(httpStatus.BAD_REQUEST)
      .json(new FailureResponse(message, httpStatus.BAD_REQUEST)),
  notFound: (response, message) =>
    response.status(httpStatus.NOT_FOUND).json(new FailureResponse(message, httpStatus.NOT_FOUND)),
  unAuthorized: (response, message) =>
    response
      .status(httpStatus.UNAUTHORIZED)
      .json(new FailureResponse(message, httpStatus.UNAUTHORIZED)),
  forbidden: (response, message) =>
    response.status(httpStatus.FORBIDDEN).json(new FailureResponse(message, httpStatus.FORBIDDEN)),
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
