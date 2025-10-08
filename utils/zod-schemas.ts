import { z } from 'zod';

const slug = z
  .string()
  .min(3, 'Slug must be at least 3 characters long')
  .max(65, 'Slug exceeds maximum length of 65 characters')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  );

const title = z
  .string()
  .min(3, 'Title must be at least 3 characters long')
  .max(65, 'Title must be at most 65 characters long');

const summary = z
  .string()
  .min(10, 'Summary must be at least 10 characters long')
  .max(250, 'Summary must be at most 250 characters long');

const markdown = z
  .string()
  .min(10, 'Markdown must be at least 10 characters long');

const image = z
  .instanceof(File)
  .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
    message: 'Image must be a PNG or JPEG file',
  });

const imageCategory = z.enum(['feature', 'preview']);

const tags = z.array(z.string()).min(1, 'At least one tag is required');

const date = z
  .string()
  .optional()
  .transform((val) =>
    val && val.trim() !== ''
      ? new Date(val).toISOString()
      : new Date().toISOString()
  );

const s3ImageKey = z
  .string()
  .min(5, 'Image key must be at least 5 characters long')
  .max(150, 'Image key must be at most 150 characters long');

const s3MarkdownKey = z
  .string()
  .min(5, 'Markdown key must be at least 5 characters long')
  .max(150, 'Markdown key must be at most 150 characters long');

const id = z.uuid();

export const Validations = {
  id,
  slug,
  title,
  summary,
  markdown,
  image,
  imageCategory,
  tags,
  publishedAt: date,
  imageKey: s3ImageKey,
  markdownKey: s3MarkdownKey,
};

export const blogSchema = z.object({
  title: Validations.title,
  slug: Validations.slug,
  summary: Validations.summary,
  markdown: Validations.markdown,
  featureImage: Validations.image,
  previewImage: Validations.image,
  tags: Validations.tags,
  publishedAt: Validations.publishedAt,
});

export const createBlogSchema = z.object({
  id: Validations.id,
  title: Validations.title,
  slug: Validations.slug,
  summary: Validations.summary,
  markdownKey: Validations.markdownKey,
  featureImageKey: Validations.imageKey,
  previewImageKey: Validations.imageKey,
  tags: Validations.tags,
  publishedAt: Validations.publishedAt,
});

export const blogMetaDataSchema = z.object({
  PK: z.literal('BLOG'),
  SK: z.string(),
  id: Validations.id,
  title: Validations.title,
  slug: Validations.slug,
  summary: Validations.summary,
  markdownKey: Validations.markdownKey,
  featureImageKey: Validations.imageKey,
  previewImageKey: Validations.imageKey,
  tags: Validations.tags,
  publishedAt: Validations.publishedAt,
});

export const createMarkdownSchema = z.object({
  blogId: Validations.id,
  markdown: Validations.markdown,
});

export const createImageSchema = z.object({
  blogId: Validations.id,
  slug: Validations.slug,
  image: Validations.image,
  category: Validations.imageCategory,
});
