import { ApiResponse } from '@/types/api/common';
import { createErrorResponse } from './response-structures';
import { StatusCodes } from 'http-status-codes';

export const postJson = async <T>(
  url: string,
  body: unknown,
  cookieHeader: string
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Request failed:', err);
      const errorResponse = createErrorResponse(
        err.error || res.statusText,
        undefined,
        res.status
      );
      return await errorResponse.json();
    }

    return await res.json();
  } catch (error) {
    console.error('Network error:', error);
    const errorResponse = createErrorResponse(
      'Network error occurred.',
      undefined,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return errorResponse.json();
  }
};

export const postForm = async <T>(
  url: string,
  formData: FormData,
  cookieHeader: string
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Request failed:', err);
      const errorResponse = createErrorResponse(
        err.error || res.statusText,
        undefined,
        res.status
      );
      return await errorResponse.json();
    }

    return await res.json();
  } catch (error) {
    console.error('Network error:', error);
    const errorResponse = createErrorResponse(
      'Network error occurred.',
      undefined,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return errorResponse.json();
  }
};
