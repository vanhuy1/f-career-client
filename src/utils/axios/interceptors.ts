import { ApiFailureResponse } from '@/utils/types/api.type';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdaptAxiosRequestConfig = AxiosRequestConfig &
  InternalAxiosRequestConfig<any>;
export const onRequest = (
  config: AdaptAxiosRequestConfig,
): AdaptAxiosRequestConfig => {
  const accessToken =
    typeof window === 'undefined' ? null : localStorage?.getItem('accessToken');
  if (config.url?.includes('/signin')) {
    delete config.headers.Authorization;
  } else if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Fix element display check
  const element = document.getElementById('block-screen');
  if (element) {
    element.style.display = 'flex';
  }
  return config;
};
export const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};
export const onResponse = (response: AxiosResponse): AxiosResponse => {
  // Fix element display check
  const element = document.getElementById('block-screen');
  if (element) {
    element.style.display = 'none';
  }
  return response;
};
export const onResponseError = (error: AxiosError<ApiFailureResponse>) => {
  // Fix element display check
  const element = document.getElementById('block-screen');
  if (element) {
    element.style.display = 'none';
  }

  const errorData: ApiFailureResponse | undefined = error?.response?.data;
  if (errorData && errorData.errorType === 'ACCESS_TOKEN_EXPIRED') {
    // !Todo: Get new access token from refresh token
  } else if (errorData && errorData.errorType === 'REFRESH_TOKEN_EXPIRED') {
    console.log(`REFRESH_TOKEN_EXPIRED`);
    // !Todo: Logout
  } else if (errorData && errorData.message) {
    // !Todo:Notification Error
    if (Array.isArray(errorData.message) && errorData?.message?.length > 0) {
      console.error(errorData.message[0]);
    } else {
      console.error(errorData.message);
    }
  } else {
    console.error(error?.message);
  }
  return Promise.reject(error);
};
export function setupInterceptorsTo(
  axiosInstance: AxiosInstance,
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
