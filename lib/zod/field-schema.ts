import { z } from 'zod';
export const fieldName = {
  title: 'Title',
  slug: 'Slug',
  summary: 'Summary',
  markdown: 'Markdown',
  image: 'Image',
  tags: 'Tags',
  publishedAt: 'Publish Date',
  imageKey: 'Image key',
  markdownKey: 'Markdown key',
  sk: 'SK',
};

const fieldValidationRules = {
  minStringLength: (length: number, fieldName: string): [number, string] => [
    length,
    `${fieldName} must be at least ${length} characters long`,
  ],
  maxStringLength: (length: number, fieldName: string): [number, string] => [
    length,
    `${fieldName} must be at most ${length} characters long`,
  ],
  minArrayLength: (length: number, fieldName: string): [number, string] => [
    length,
    `${fieldName} must contain at least ${length} ${length === 1 ? 'item' : 'items'}`,
  ],
  maxArrayLength: (length: number, fieldName: string): [number, string] => [
    length,
    `${fieldName} must contain at most ${length} ${length === 1 ? 'item' : 'items'}`,
  ],
};

const slug = z
  .string()
  .min(...fieldValidationRules.minStringLength(3, fieldName.slug))
  .max(...fieldValidationRules.maxStringLength(65, fieldName.slug))
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    `${fieldName.slug} must contain only lowercase letters, numbers, and hyphens`
  );

const title = z
  .string()
  .min(...fieldValidationRules.minStringLength(3, fieldName.title))
  .max(...fieldValidationRules.maxStringLength(65, fieldName.title));

const summary = z
  .string()
  .min(...fieldValidationRules.minStringLength(10, fieldName.summary))
  .max(...fieldValidationRules.maxStringLength(250, fieldName.summary));

const markdown = z
  .string()
  .min(...fieldValidationRules.minStringLength(10, fieldName.markdown));

const image = z
  .instanceof(File)
  .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
    message: 'Image must be a PNG or JPEG file',
  });

const imageCategory = z.enum(['feature', 'preview']);

const tags = z
  .array(z.string())
  .min(...fieldValidationRules.minArrayLength(1, fieldName.tags))
  .max(...fieldValidationRules.maxArrayLength(5, fieldName.tags));

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
  .min(...fieldValidationRules.minStringLength(5, fieldName.imageKey))
  .max(...fieldValidationRules.maxStringLength(150, fieldName.imageKey));

const s3MarkdownKey = z
  .string()
  .min(...fieldValidationRules.minStringLength(5, fieldName.markdownKey))
  .max(...fieldValidationRules.maxStringLength(150, fieldName.markdownKey));

const id = z.uuid();

const sk = z
  .string()
  .min(...fieldValidationRules.minStringLength(5, fieldName.sk))
  .max(...fieldValidationRules.maxStringLength(100, fieldName.sk));

const question = z
  .string()
  .min(...fieldValidationRules.minStringLength(10, 'Question'))
  .max(...fieldValidationRules.maxStringLength(100, 'Question'));

const customiseQuestion = z
  .string()
  .max(...fieldValidationRules.maxStringLength(200, 'Question'))
  .optional();

export const FieldSchemas = {
  id,
  slug,
  title,
  summary,
  markdown,
  image,
  imageCategory,
  tags,
  publishedAt: date,
  createdAt: date,
  imageKey: s3ImageKey,
  markdownKey: s3MarkdownKey,
  sk,
  question,
  customiseQuestion,
};
