import httpResponse from '../helpers/httpResponse';

const undefinedRequestHandler = (request, response) =>
  httpResponse.notFound(response, `Not Found Route, ${request.method}, ${request.path}`);

export default undefinedRequestHandler;
