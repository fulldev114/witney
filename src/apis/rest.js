import RequestHelper from '@helpers/RequestHelper';

const RestApi = {
  get: (url, params = {}, headers = {}) => {
    const realHeaders = { ...headers };
    const queryString = RequestHelper.serialize(params);
    let realURL = url;
    if (queryString) {
      realURL = `${url}?${queryString}`;
    }
    return fetch(realURL, {
      method: 'GET',
      headers: realHeaders,
    });
  },
  post: (url, params = {}, headers = {}) => {
    const realHeaders = { ...headers };
    return fetch(url, {
      method: 'POST',
      headers: realHeaders,
      body: params,
    });
  },
  put: (url, params = {}, headers = {}) => {
    const realHeaders = { ...headers };
    return fetch(url, {
      method: 'PUT',
      headers: realHeaders,
      body: params,
    });
  },
  delete: (url, params = {}, headers = {}) => {
    const realHeaders = { ...headers };
    const queryString = RequestHelper.serialize(params);
    let realURL = url;
    if (queryString) {
      realURL = `${url}?${queryString}`;
    }
    return fetch(realURL, {
      method: 'DELETE',
      headers: realHeaders,
    });
  },
};

export default RestApi;
