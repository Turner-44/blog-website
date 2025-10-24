import { ApiResponse } from '@/types/api/common';
import { createErrorResponse } from './response-structures';

export const deleteRequest = async <T>(
  url: string,
  cookieHeader: string
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
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
      500
    );
    return errorResponse.json();
  }
};
