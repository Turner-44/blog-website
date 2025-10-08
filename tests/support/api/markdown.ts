import { CreateBlogDataAPI } from '@/tests/data/create-blog';
import { MarkdownResponses } from '@/types/api/markdown';
import type { APIRequestContext } from '@playwright/test';

export const storeMarkdown = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI
): Promise<MarkdownResponses['Post']> => {
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
