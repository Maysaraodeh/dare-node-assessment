import parseError from 'parse-error';

export const errorHandler = (error, request, response, next) => {
  const statusCode = error.status || 500;
  let jsonError;
  try {
    jsonError = parseError(error);
  } catch (ex) {
    jsonError = error;
  }
  if (request.app.get('env') !== 'production') {
    response.status(statusCode).json(jsonError);
  } else {
    response.status(statusCode).send({
      error: jsonError.message,
      type: jsonError.type,
    });
  }
  next();
};
