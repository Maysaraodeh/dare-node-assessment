import * as httpStatus from 'http-status-codes';

const FailureResponse = function FailureResponse(message) {
  this.success = false;
  this.message = message;
};

const SuccessResponse = function SuccessResponse(data, message) {
  if (data && typeof data === 'string') {
    message = data;
    data = null;
  }
  this.success = true;
  if (data) this.data = data;

  if (message) this.message = message;
};

export default {
  ok: (response, data, message) =>
    response.status(httpStatus.OK).json(new SuccessResponse(data, message)),
  badRequest: (response, message) =>
    response.status(httpStatus.BAD_REQUEST).json(new FailureResponse(message)),
  notFound: (response, message) =>
    response.status(httpStatus.NOT_FOUND).json(new FailureResponse(message)),
  unAuthorized: (response, message) =>
    response.status(httpStatus.UNAUTHORIZED).json(new FailureResponse(message)),
  forbidden: (response, message) =>
    response.status(httpStatus.FORBIDDEN).json(new FailureResponse(message)),
  notAllowedMethod: (request, response, message) =>
    response
      .status(httpStatus.METHOD_NOT_ALLOWED)
      .json(
        new FailureResponse(
          message ||
            `The requested resource does not support http method '${request.method}'.'${request.path}'`
        )
      ),
  internalServerError: (next, error) => next(error),
};
