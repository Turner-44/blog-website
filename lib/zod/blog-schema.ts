import { z } from 'zod';
import { FieldSchemas } from './field-schema';

export const blogUiFormSchema = z.object({
  title: FieldSchemas.title,
  slug: FieldSchemas.slug,
  summary: FieldSchemas.summary,
  markdown: FieldSchemas.markdown,
  featureImage: FieldSchemas.image,
  previewImage: FieldSchemas.image,
  tags: FieldSchemas.tags,
  publishedAt: FieldSchemas.publishedAt,
});

export const createBlogSchema = z.object({
  id: FieldSchemas.id,
  title: FieldSchemas.title,
  slug: FieldSchemas.slug,
  summary: FieldSchemas.summary,
  markdownKey: FieldSchemas.markdownKey,
  featureImageKey: FieldSchemas.imageKey,
  previewImageKey: FieldSchemas.imageKey,
  tags: FieldSchemas.tags,
  publishedAt: FieldSchemas.publishedAt,
});

export const blogSchema = z.object({
  PK: z.literal('BLOG'),
  SK: FieldSchemas.sk,
  id: FieldSchemas.id,
  title: FieldSchemas.title,
  slug: FieldSchemas.slug,
  summary: FieldSchemas.summary,
  markdownKey: FieldSchemas.markdownKey,
  featureImageKey: FieldSchemas.imageKey,
  previewImageKey: FieldSchemas.imageKey,
  tags: FieldSchemas.tags,
  publishedAt: FieldSchemas.publishedAt,
});
