'use client';

import { storeCompleteBlogPost } from './store-data';
import { BlogFormData } from '@/types/blog';
import type { UseFormReturnType } from '@mantine/form';
import { checkSlugAvailability } from '../blog-slug-check';

const handleExistingSlug = (
  form: UseFormReturnType<BlogFormData>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
) => {
  form.setFieldError('slug', 'This slug is already in use.');
  form.setFieldError('root', 'Please fix the errors above.');
  setSuccess(false);
};

const handleFormValid = (
  form: UseFormReturnType<BlogFormData>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSuccess(true);
  form.reset();
};

const handleFormError = (
  form: UseFormReturnType<BlogFormData>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  result: { message?: string }
) => {
  setSuccess(false);
  form.setFieldError('root', result.message ?? 'An unknown error occurred.');
};

export async function createBlogPost(
  values: BlogFormData,
  form: UseFormReturnType<BlogFormData>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    const payload: BlogFormData = {
      ...values,
      publishedAt: values.publishedAt || new Date().toISOString(),
    };

    if (!(await checkSlugAvailability(payload.slug))) {
      handleExistingSlug(form, setSuccess);
      return;
    }

    console.log('Creating blog post with payload:', payload);

    const result = await storeCompleteBlogPost(payload);

    console.log('Blog post creation result:', result);

    if (result.success) {
      handleFormValid(form, setSuccess);
    } else {
      handleFormError(form, setSuccess, result);
    }
  } catch (error) {
    console.error(error);
    form.setFieldError('root', 'Something went wrong. Please try again.');
    setSuccess(false);
  }
}
