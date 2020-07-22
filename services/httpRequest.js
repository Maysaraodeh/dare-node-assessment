import request from 'request';

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
      resolve(httpResponse);
    });
  });
