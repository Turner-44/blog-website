import { revalidateIn1Year } from '@/utils/dates';

export const markdownFetchOptions = {
  next: { revalidate: revalidateIn1Year, tags: ['markdown'] },
};

export const imageFetchOptions = {
  next: { revalidate: revalidateIn1Year, tags: ['images'] },
};

export const blogPostFetchOptions = {
  cache: 'no-store' as const,
  next: { revalidate: 0, tags: ['blog-post'] },
};

export const fetchOptions = {
  markdown: markdownFetchOptions,
  image: imageFetchOptions,
  blogPost: blogPostFetchOptions,
};
