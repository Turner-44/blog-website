export interface ApiErrorResponse {
  error: string;
  filePath?: string | null;
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

export interface BlogsResponseItem {
  PK: 'BLOG';
  SK: string;
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageKey: string;
  markdownKey: string;
  publishedAt: string;
  tags: string[];
}

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
