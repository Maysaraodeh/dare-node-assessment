import request from 'request';
import { getExpirationTime } from '../helpers/utils';
import property from '../helpers/propertiesReader';
import tokenErrors from '../middlewares/errors/authTokenErros';
import { RemoteAPIError } from '../middlewares/errors';
import dataCache from './cache';

const {
  INSURANCE_API_CLIENT_ID,
  INSURANCE_API_CLIENT_SECRET,
  INSURANCE_API_BASE_URL,
} = process.env;

export const httpPostJson = (url, body, headers) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
      json: true,
    };

    request(options, (error, response, responseBody) => {
      if (error) return reject(error);
      let resBody = responseBody;
      if (typeof responseBody === 'string') resBody = JSON.parse(responseBody);
      const httpResponse = {};
      if (response.statusCode >= 400) httpResponse.failure = resBody;
      else httpResponse.success = resBody;
      httpResponse.headers = response.headers || {};
      return resolve(httpResponse);
    });
  });

export const httpGet = (url, headers) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      json: true,
    };

    request(options, (error, response, responseBody) => {
      if (error) return reject(error);
      let resBody = responseBody;
      if (typeof responseBody === 'string') resBody = JSON.parse(responseBody);

      const httpResponse = {};
      if (response.statusCode >= 400) httpResponse.failure = resBody || 'Authentication Error';
      else httpResponse.success = resBody;
      httpResponse.headers = response.headers || {};
      return resolve(httpResponse);
    });
  });

export const getAuthToken = async (cacheToken = true) => {
  // cached token
  if (dataCache.get('authToken')) return dataCache.get('authToken');
  const { success = {}, failure } = await httpPostJson(`${INSURANCE_API_BASE_URL}/login`, {
    client_id: INSURANCE_API_CLIENT_ID,
    client_secret: INSURANCE_API_CLIENT_SECRET,
  });
  if (failure) throw new RemoteAPIError(failure.message || failure);
  if (!success.token || !success.type) {
    throw new RemoteAPIError('no token found');
  }

  // setToken for nextTime
  if (cacheToken) dataCache.set('authToken', { ...success });
  return success;
};

export const getDataFromAPI = async (path, { cache = true, repository }) => {
  const { token, type } = await getAuthToken();
  const { success, failure, headers } = await httpGet(`${INSURANCE_API_BASE_URL}/${path}`, {
    Authorization: `${type} ${token}`,
  });
  if (failure) {
    if (tokenErrors.includes(failure.message)) {
      repository.del('authToken');
      return getDataFromAPI(path, { cache, repository });
    }
    throw new Error(failure.message || failure);
  }
  if (!success) throw new Error(property(`${path}.notFound`));
  if (cache) repository.set(path, success, getExpirationTime(headers));
  return success;
};
