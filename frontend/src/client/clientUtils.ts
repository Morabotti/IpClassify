import { HttpMethod, RequestOptions } from './types';
import { createSearchParams } from '@utils/queryUtils';

let token: null | string = null;

export const setAuthToken = (set: string) => {
  token = set;
};

export const clearAuthToken = () => {
  token = null;
};

export const checkResponse = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    throw new Error(`${response.status.toString()}: ${response.statusText}`);
  }
  return response;
};

export const createClient = (baseUrl: string, baseAddress: string) => {
  return <T>(url: string, method?: HttpMethod, options?: RequestOptions): Promise<T> => {
    const searchParams = createSearchParams(options?.params as unknown[] ?? []);

    return fetch(
      `${baseUrl}${baseAddress}${url}${searchParams ? `?${searchParams}` : ''}`,
      {
        method: method ?? 'GET',
        body: options?.body
          ? options?.blob
            ? options.body as FormData
            : JSON.stringify(options.body)
          : undefined,
        headers: {
          ...(!options?.blob && { 'Content-Type': 'application/json' }),
          ...((options?.token ?? token) && { Authorization: `Bearer ${options?.token ?? token}` })
        }
      }
    )
      .then(res => checkResponse(res))
      .then(res => options?.skipJson ? res : res.json());
  };
};
