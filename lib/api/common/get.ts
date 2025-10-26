import { ApiResponse } from '@/types/api/common';
import { createErrorResponse } from './response-helper';
import { StatusCodes } from 'http-status-codes';

interface FetchOptions extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate: number;
  };
}

export const getRequest = async <T>(
  url: string,
  fetchOptions: FetchOptions
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorResponse = createErrorResponse(
        err.error || res.statusText,
        undefined,
        res.status
      );
      return await errorResponse.json();
    }

    return await res.json();
  } catch (error) {
    const errorResponse = createErrorResponse(
      'Network error occurred.',
      undefined,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return errorResponse.json();
  }
};
