import { request } from '@playwright/test';
import fs from 'fs';
import { resolveFromRoot, TEST_PATHS } from '@/utils/paths';

export const createApiContextDefaultTestCookies = async () => {
  const cookieJson = JSON.parse(
    fs.readFileSync(
      resolveFromRoot(TEST_PATHS.testAuth + '/cookies.json'),
      'utf-8'
    )
  );

  const cookieHeader = cookieJson.cookies
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ');

  return await request.newContext({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    extraHTTPHeaders: {
      Cookie: cookieHeader,
    },
  });
};
