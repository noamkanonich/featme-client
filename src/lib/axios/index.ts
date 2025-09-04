import axios from 'axios';
import { BASE_URL, FEATME_SERVER_BASE_URL } from '@env';

export const init = () => {
  axios.defaults.baseURL = FEATME_SERVER_BASE_URL + '/api';
  axios.defaults.headers.common.Authorization = 'Bearer';
};

console.log('BASE_URL: ' + FEATME_SERVER_BASE_URL);
console.log('LOCAL BASE_URL: ' + BASE_URL);

export const addOnUnauthorizedCallback: (cb: () => void) => number = cb => {
  return axios.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        cb();
      }
      return Promise.reject(err);
    },
  );
};

export const setAuthorizationHeader = (accessToken: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export const clearAuthorizationHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

export const removeResponseInterceptor = (interceptorId: number) => {
  axios.interceptors.response.eject(interceptorId);
};

export const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const postFetcher = async (url: string, data?: any) => {
  const response = await axios.post(url, data);
  return response.data;
};
