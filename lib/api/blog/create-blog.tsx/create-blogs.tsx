'use client';

import { storeCompleteBlogPost } from './store-data';
import { BlogFormData } from '@/types/blog';
import type { UseFormReturnType } from '@mantine/form';
import { checkSlugAvailability } from '../blog-slug-check';

const errorMessages = {
  slugExists: 'This slug is already in use.',
  fixErrorsAbove: 'Please fix the errors above.',
  unknownError: 'An unknown error occurred.',
  tryAgain: 'Something went wrong. Please try again.',
} as const;

interface BlogPostHandlers {
  form: UseFormReturnType<BlogFormData>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleSlugConflict = ({ form, setSuccess }: BlogPostHandlers): void => {
  form.setFieldError('slug', errorMessages.slugExists);
  form.setFieldError('root', errorMessages.fixErrorsAbove);
  setSuccess(false);
};

const handleFormValid = ({ form, setSuccess }: BlogPostHandlers): void => {
  setSuccess(true);
  form.reset();
};

const handleFormError = (
  { form, setSuccess }: BlogPostHandlers,
  result: { message?: string }
): void => {
  setSuccess(false);
  form.setFieldError('root', result.message ?? errorMessages.unknownError);
};

export async function createBlogPost(
  values: BlogFormData,
  form: UseFormReturnType<BlogFormData>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> {
  const handlers: BlogPostHandlers = { form, setSuccess };

  try {
    const payload: BlogFormData = {
      ...values,
      publishedAt: values.publishedAt || new Date().toISOString(),
    };

    const isSlugAvailable = await checkSlugAvailability(payload.slug);
    if (!isSlugAvailable) {
      handleSlugConflict(handlers);
      return;
    }

    const result = await storeCompleteBlogPost(payload);

    if (result.success) {
      handleFormValid(handlers);
    } else {
      handleFormError(handlers, result);
    }
  } catch (error) {
    console.error('Failed to create blog post:', {
      error,
      slug: values.slug,
      timestamp: new Date().toISOString(),
    });

    form.setFieldError('root', errorMessages.tryAgain);
    setSuccess(false);
  }
}
