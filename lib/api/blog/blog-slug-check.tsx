import { FieldSchemas } from '@/lib/zod';
import z from 'zod';
import { getRequest } from '../common/get';
import { fetchOptions } from '../common/caching';
import { SlugResponses } from '@/types/api/blogs-slug';
import { UnknownError } from '@/errors/api-errors';

export const checkSlugAvailability = async (
  slug: z.infer<typeof FieldSchemas.slug>
) => {
  const blogPostRes = await getRequest<SlugResponses['Get']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
    fetchOptions.blogPost
  );

  if (!blogPostRes.success) {
    const unknownError = new UnknownError('Error checking slug availability', {
      slugProvided: slug,
      blogPostRes,
    });
    unknownError.log();
    throw unknownError;
  }

  return blogPostRes.data.slugAvailable;
};
