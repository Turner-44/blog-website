import test, { expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { createApiContextDefaultTestCookies } from '../support/api/common';

test.describe('API tests', { tag: '@api' }, () => {
  test('getBlogsBySlug API validation', async ({}) => {
    const apiContext = await createApiContextDefaultTestCookies();

    const blankSlugValue = await apiContext.get(`/api/blogs?slug=`);
    expect(blankSlugValue.status()).toBe(StatusCodes.BAD_REQUEST);

    const slugAsNumber = await apiContext.get(`/api/blogs?slug=${1}`);
    expect(slugAsNumber.status()).toBe(StatusCodes.BAD_REQUEST);

    const invalidSlug = await apiContext.get(`/api/blogs?slug=invalid slug`);
    expect(invalidSlug.status()).toBe(StatusCodes.BAD_REQUEST);
  });
});
