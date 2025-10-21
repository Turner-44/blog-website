import { FieldSchemas } from '@/lib/zod';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';

export const checkSlugAvailability = async (
  slug: z.infer<typeof FieldSchemas.slug>
) => {
  const blogPostRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
    { cache: 'no-store', next: { revalidate: 0 } }
  );

  return blogPostRes.status === StatusCodes.NOT_FOUND ? true : false;
};
