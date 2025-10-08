import { BlogMetaData } from './blog';

export interface ApiErrorResponse {
  message: string;
  success: false;
}

export interface ImagePostResponse {
  blogId: string;
  slug: string;
  imageKey: string;
}

export interface ImageDeleteResponse {
  message: string;
  imageKey: string;
}

export interface MarkdownPostResponse {
  blogId: string;
  markdownKey: string;
}

export interface MarkdownGetResponse {
  markdown: string;
}

export interface MarkdownDeleteResponse {
  message: string;
  markdownKey: string;
}

export type BlogsResponseItem = BlogMetaData;

export interface BlogsPostResponse {
  item: BlogsResponseItem;
}

export interface BlogsGetResponse {
  items: BlogsResponseItem[];
}

export interface BlogsDeleteResponse {
  message: string;
  PK: string;
  SK: string;
}
