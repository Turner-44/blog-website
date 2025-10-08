import { resolveFromRoot, TEST_PATHS } from '@/utils/paths';
import fs from 'fs';
import test, { expect, request } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test.describe('API tests', { tag: '@api' }, () => {
  test('getBlogsBySlug API validation', async ({}) => {
    const cookieJson = JSON.parse(
      fs.readFileSync(
        resolveFromRoot(TEST_PATHS.testAuth + '/cookies.json'),
        'utf-8'
      )
    );

    const cookieHeader = cookieJson.cookies
      .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
      .join('; ');

    const apiContext = await request.newContext({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      extraHTTPHeaders: {
        Cookie: cookieHeader,
      },
    });

    const blankSlugValue = await apiContext.get(`/api/blogs?slug=`);
    expect(blankSlugValue.status()).toBe(StatusCodes.BAD_REQUEST);

    const slugAsNumber = await apiContext.get(`/api/blogs?slug=${1}`);
    expect(slugAsNumber.status()).toBe(StatusCodes.BAD_REQUEST);

    const invalidSlug = await apiContext.get(`/api/blogs?slug=invalid slug`);
    expect(invalidSlug.status()).toBe(StatusCodes.BAD_REQUEST);
  });
});
