import { z } from 'zod';

export const blogScheme = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(50, 'Title must be at most 50 characters long'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters long')
    .max(50, 'Slug must be at most 50 characters long'),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters long')
    .max(200, 'Summary must be at most 200 characters long'),
  markdown: z.string().min(10, 'Markdown must be at least 10 characters long'),
  featureImage: z.file().mime(['image/png', 'image/jpeg']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  publishedAt: z.string().optional(),
});

export type BlogFormData = z.infer<typeof blogScheme>;
