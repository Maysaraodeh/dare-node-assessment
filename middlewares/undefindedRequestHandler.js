import httpResponse from '../helpers/httpResponse';

export const undefinedRequestHandler = (request, response) =>
  httpResponse.notFound(
    response,
    `Not Found Route, ${request.method}, ${request.path}`
  );
