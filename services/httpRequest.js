import request from 'request';
import { getAuthToken } from './selfAuth';
import { getExpirationTime } from '../helpers/utils';
import config from '../config';
import { property } from '../helpers/propertiesReader';
import { tokenErrors } from '../middlewares/errors/authTokenErros';
const { INSURANCE_API_BASE_URL } = config;

export const httpPostJson = (url, body, headers) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      json: true,
    };
    if (headers) {
      Object.keys(headers).forEach((key) => {
        options.headers[key] = headers[key];
      });
    }
    request(options, (error, response, responseBody) => {
      if (error) return reject(error);
      if (typeof responseBody === 'string')
        responseBody = JSON.parse(responseBody);
      const httpResponse = {};
      if (response.statusCode >= 400) httpResponse.failure = responseBody;
      else httpResponse.success = responseBody;
      httpResponse.headers = response.headers || {};
      resolve(httpResponse);
    });
  });

export const httpGet = (url, headers) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    if (headers) {
      Object.keys(headers).forEach((key) => {
        options.headers[key] = headers[key];
      });
    }
    request(options, (error, response, responseBody) => {
      if (error) return reject(error);
      if (typeof responseBody === 'string')
        responseBody = JSON.parse(responseBody);

      const httpResponse = {};
      if (response.statusCode >= 400)
        httpResponse.failure = responseBody || 'Authentication Error';
      else httpResponse.success = responseBody;
      httpResponse.headers = response.headers || {};
      resolve(httpResponse);
    });
  });

export const getDataFromAPI = async (path, { cache = true, repository }) => {
  const { token, type } = await getAuthToken();
  const { success, failure, headers } = await httpGet(
    `${INSURANCE_API_BASE_URL}/${path}`,
    {
      Authorization: `${type} ${token}`,
    }
  );
  if (failure) {
    if (tokenErrors.includes(failure.message)) {
      repository.del('authToken');
      return getDataFromAPI(path, { cache, repository });
    } else throw new Error(failure.message || failure);
  }
  if (!success) throw new Error(property(`${path}.notFound`));
  if (cache) repository.set(path, success, getExpirationTime(headers));
  return success;
};
