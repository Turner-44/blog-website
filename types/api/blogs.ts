import { createBlogSchema } from '@/lib/zod';
import { BlogMetaData } from '../blog';
import z from 'zod';

export type BlogsResponses = {
  Post: BlogsPostResponse;
  Get: BlogsGetResponse;
  Delete: BlogsDeleteResponse;
};

interface BlogsPostResponse {
  item: BlogMetaData;
}

interface BlogsGetResponse {
  items: BlogMetaData[];
}

interface BlogsDeleteResponse {
  message: string;
  PK: string;
  SK: string;
}

export type BlogsRequestBody = { Post: BlogsPostRequestBody };

export type BlogsPostRequestBody = z.infer<typeof createBlogSchema>;
