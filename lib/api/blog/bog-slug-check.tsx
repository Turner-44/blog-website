import { FieldSchemas } from '@/lib/zod';
import z from 'zod';

export const checkSlugAvailability = async (
  slug: z.infer<typeof FieldSchemas.slug>
) => {
  const blogPostRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
    { cache: 'no-store', next: { revalidate: 0 } }
  );

  const existingSlug = await blogPostRes.json();

  return existingSlug.blogPost ? false : true;
};
