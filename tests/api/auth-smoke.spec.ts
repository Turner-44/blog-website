import test, { expect, request } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { createBlogPostDataAPI } from '@/tests/data/create-blog';

test.describe('API tests', { tag: ['@api', '@smoke'] }, () => {
  test('Check blogs API endpoints', async ({}) => {
    const apiContext = await request.newContext({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      extraHTTPHeaders: {},
    });

    const data = createBlogPostDataAPI();
    const createResponse = await apiContext.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`,
      {
        data,
      }
    );

    expect(createResponse.status()).toBe(StatusCodes.UNAUTHORIZED);

    const DeleteResponse = await apiContext.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?sk=${encodeURIComponent('non-existent-sk')}`
    );
    expect(DeleteResponse.status()).toBe(StatusCodes.UNAUTHORIZED);

    const getResponse = await apiContext.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`
    );
    expect(getResponse.status()).toBe(StatusCodes.OK);
  });

  test('Check markdown API endpoints', async ({}) => {
    const apiContext = await request.newContext({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      extraHTTPHeaders: {},
    });

    const data = { markdown: '# Sample Markdown', blogId: 'blog-id' };

    const createResponse = await apiContext.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${data.blogId}/markdown`,
      {
        data,
      }
    );

    expect(createResponse.status()).toBe(StatusCodes.UNAUTHORIZED);

    const DeleteResponse = await apiContext.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${data.blogId}/markdown?markdownKey=${encodeURIComponent('non-existent-key')}`
    );
    expect(DeleteResponse.status()).toBe(StatusCodes.UNAUTHORIZED);

    const getResponse = await apiContext.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${data.blogId}/markdown?markdownKey=${encodeURIComponent('non-existent-key')}`
    );
    expect(getResponse.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR); // Need to handle aws default errors for accessDenied
  });

  test('Check image API endpoints', async ({}) => {
    const apiContext = await request.newContext({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      extraHTTPHeaders: {},
    });

    const data = {
      id: 'blog-id',
      slug: 'blog-slug',
      imageFile: 'test-image.png',
      category: 'feature',
      blogId: 'blog-id',
    };

    const createResponse = await apiContext.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${data.blogId}/markdown`,
      {
        multipart: {
          blogId: data.id,
          slug: data.slug,
          image: data.imageFile,
          category: data.category,
        },
      }
    );

    expect(createResponse.status()).toBe(StatusCodes.UNAUTHORIZED);

    const DeleteResponse = await apiContext.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${data.blogId}/image?imageKey=${encodeURIComponent('non-existent-key')}`
    );
    expect(DeleteResponse.status()).toBe(StatusCodes.UNAUTHORIZED);
  });
});
