import { CreateBlogDataAPI } from '@/tests/data/create-blog';
import type { APIRequestContext } from '@playwright/test';

export const storeMarkdown = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI
) => {
  const markdownBody = JSON.stringify({
    blogId: blogData.id,
    markdown: blogData.markdown,
  });

  const markdownRes = await apiContext.post(
    `/api/blogs/${blogData.id}/markdown`,
    {
      data: markdownBody,
    }
  );

  return await markdownRes.json();
};
