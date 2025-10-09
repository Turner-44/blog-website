import { createUIErrorResponse } from '@/lib/error-handling/ui';

export const postJson = async <T>(
  url: string,
  body: unknown,
  cookieHeader: string
): Promise<
  { success: true; data: T } | { success: false; message: string }
> => {
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
      return createUIErrorResponse(err.error || res.statusText);
    }

    return { success: true, data: await res.json() };
  } catch (error) {
    console.error('Network error:', error);
    return createUIErrorResponse('Network error occurred.');
  }
};

export const postForm = async <T>(
  url: string,
  formData: FormData,
  cookieHeader: string
): Promise<
  { success: true; data: T } | { success: false; message: string }
> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Form request failed:', err);
      return createUIErrorResponse(err.error || res.statusText);
    }
    return { success: true, data: await res.json() };
  } catch (error) {
    console.error('Network error:', error);
    return createUIErrorResponse('Network error occurred.');
  }
};
