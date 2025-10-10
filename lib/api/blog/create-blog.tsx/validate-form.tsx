import z from 'zod';
import { blogUiFormSchema, TreeifiedError } from '@/lib/zod';
import { BlogFormData } from '@/types/blog';

export type FormValidationResult =
  | { success: true; data: BlogFormData }
  | { success: false; message: string; fieldErrors: TreeifiedError };

export const validateFormData = (data: FormData): FormValidationResult => {
  console.log('FormData Feature Image:', data.get('featureImage'));

  const parsed = blogUiFormSchema.safeParse({
    title: data.get('title'),
    slug: data.get('slug'),
    summary: data.get('summary'),
    markdown: data.get('markdown'),
    featureImage: data.get('featureImage'),
    previewImage: data.get('previewImage'),
    tags: (data.get('tags') as string)
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== ''),
    publishedAt: data.get('publishedAt'),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation failed.',
      fieldErrors: z.treeifyError(parsed.error),
    };
  }

  return { success: true as const, data: parsed.data };
};
