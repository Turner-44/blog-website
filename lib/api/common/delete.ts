import { createUIErrorResponse } from '@/lib/error-handling/ui';

export const deleteRequest = async <T>(
  url: string,
  cookieHeader: string
): Promise<
  { success: true; data: T } | { success: false; message: string }
> => {
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
      return createUIErrorResponse(err.error || res.statusText);
    }

    return { success: true, data: await res.json() };
  } catch (error) {
    console.error('Network error:', error);
    return createUIErrorResponse('Network error occurred.');
  }
};
