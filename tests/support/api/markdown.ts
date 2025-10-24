import { BlogCreationError } from '@/errors/api-errors';
import { SuccessResponse } from '@/lib/api/common/response-structures';
import { CreateBlogPostDataAPI } from '@/tests/data/create-blog';
import { MarkdownResponses } from '@/types/api/markdown';
import type { APIRequestContext } from '@playwright/test';

export const storeMarkdown = async (
  apiContext: APIRequestContext,
  blogPost: CreateBlogPostDataAPI
): Promise<SuccessResponse<MarkdownResponses['Post']>> => {
  const markdownBody = JSON.stringify({
    blogId: blogPost.id,
    markdown: blogPost.markdown,
  });

  const markdownRes = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogPost.id}/markdown`,
    {
      data: markdownBody,
    }
  );

  const markdownJson = await markdownRes.json();

  if (!markdownJson.success) {
    throw new BlogCreationError(markdownJson.message);
  }

  return markdownJson;
};
