import axios, { type AxiosRequestConfig } from "axios";

export const get = <T>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
) =>
  axios.get<T>(url, {
    ...config,
    params: params,
  });

export const post = <TResponse, TRequest = unknown>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig
) => axios.post<TResponse>(url, data, config);

export const put = <T>(url: string, data: T, params?: object) =>
  axios.put<T>(url, data, { ...params });
