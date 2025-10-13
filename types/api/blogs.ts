import { createBlogSchema } from '@/lib/zod';
import { BlogPost } from '../blog';
import z from 'zod';

export type BlogsResponses = {
  Post: BlogPost;
  Get: BlogsGetResponse;
  Delete: BlogsDeleteResponse;
};

interface BlogsGetResponse {
  blogPosts: BlogPost[];
  nextCursor: string | null;
}

interface BlogsDeleteResponse {
  message: string;
  PK: string;
  SK: string;
}

export type BlogsRequestBody = { Post: BlogsPostRequestBody };

export type BlogsPostRequestBody = z.infer<typeof createBlogSchema>;
