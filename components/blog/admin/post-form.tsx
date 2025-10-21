'use client';

import React, { useState } from 'react';
import { CiImageOn } from 'react-icons/ci';
import { FaPaperclip } from 'react-icons/fa6';

import { TextInput, Textarea, FileInput, TagsInput } from '@mantine/core';

import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';

import { Button } from '@/components/shared-components/button';
import { createBlog } from '@/lib/api/blog/create-blog.tsx/create-blogs';
import { blogUiFormSchema } from '@/lib/zod';
import { BlogFormData } from '@/types/blog';
import { checkSlugAvailability } from '@/lib/api/blog/bog-slug-check';

export default function CreateBlogForm() {
  const form = useForm({
    initialValues: {
      title: '',
      slug: '',
      summary: '',
      markdown: '',
      featureImage: new File([], '', { type: 'application/octet-stream' }),
      previewImage: new File([], '', { type: 'application/octet-stream' }),
      tags: [],
      publishedAt: '',
    },
    validate: zod4Resolver(blogUiFormSchema),
  });

  const [success, setSuccess] = useState(false);

  return (
    <form
      // TODO Abstract submit handler logic into a separate function
      onSubmit={form.onSubmit(
        async (values: BlogFormData) => {
          try {
            const payload: BlogFormData = {
              ...values,
              publishedAt: values.publishedAt || new Date().toISOString(),
            };

            const isSlugAvailable = await checkSlugAvailability(payload.slug);
            if (!isSlugAvailable) {
              form.setFieldError('slug', 'This slug is already in use.');
              form.setFieldError('root', 'Please fix the errors above.');
              setSuccess(false);
              return;
            }

            const result = await createBlog(payload);

            if (result.success) {
              setSuccess(true);
              form.reset();
            } else {
              setSuccess(false);
              form.setFieldError(
                'root',
                result.message ?? 'An unknown error occurred.'
              );
            }
          } catch (error) {
            console.error(error);
            form.setFieldError(
              'root',
              'Something went wrong. Please try again.'
            );
            setSuccess(false);
          }
        },
        () => {
          form.setFieldError('root', 'Please fix the errors above.');
        }
      )}
      className="relative flex flex-col max-w-2xl mx-auto"
      autoComplete="off"
    >
      <TextInput
        label="Blog Title"
        name="title"
        wrapperProps={{ 'data-testid': 'field-blog-title' }}
        data-testid="input-blog-title"
        withAsterisk
        {...form.getInputProps('title')}
      />
      <TextInput
        label="Blog Slug:"
        name="slug"
        wrapperProps={{ 'data-testid': 'field-blog-slug' }}
        data-testid="input-blog-slug"
        withAsterisk
        {...form.getInputProps('slug')}
      />
      <TextInput
        label="Blog Summary:"
        name="summary"
        wrapperProps={{ 'data-testid': 'field-blog-summary' }}
        data-testid="input-blog-summary"
        withAsterisk
        {...form.getInputProps('summary')}
      />
      <Textarea
        label="Blog Content:"
        name="markdown"
        wrapperProps={{ 'data-testid': 'field-blog-markdown' }}
        data-testid="input-blog-markdown"
        withAsterisk
        {...form.getInputProps('markdown')}
      />
      <FileInput
        leftSection={<CiImageOn />}
        rightSection={<FaPaperclip />}
        label="Upload feature image:"
        name="featureImage"
        wrapperProps={{ 'data-testid': 'field-blog-feature-image' }}
        data-testid="input-blog-feature-image"
        withAsterisk
        {...form.getInputProps('featureImage')}
        className="w-1/2 md:w-1/3 self-start"
        onChange={(file) =>
          form.setFieldValue(
            'featureImage',
            file ?? new File([], '', { type: 'application/octet-stream' })
          )
        }
      />
      <FileInput
        leftSection={<CiImageOn />}
        rightSection={<FaPaperclip />}
        label="Upload preview image:"
        name="previewImage"
        wrapperProps={{ 'data-testid': 'field-blog-preview-image' }}
        data-testid="input-blog-preview-image"
        withAsterisk
        {...form.getInputProps('previewImage')}
        className="w-1/2 md:w-1/3 self-start"
        onChange={(file) =>
          form.setFieldValue(
            'previewImage',
            file ?? new File([], '', { type: 'application/octet-stream' })
          )
        }
      />
      <TagsInput
        label="Blog Tags:"
        name="tags"
        wrapperProps={{ 'data-testid': 'field-blog-tags' }}
        data-testid="input-blog-tags"
        withAsterisk
        {...form.getInputProps('tags')}
      />
      <DateTimePicker
        label="Publish Date:"
        name="publishedAt"
        wrapperProps={{ 'data-testid': 'field-blog-publishedAt' }}
        data-testid="input-blog-publishedAt"
        {...form.getInputProps('publishedAt')}
      />
      <Button
        type="submit"
        className="Button-primary mt-4 mx-auto"
        disabled={form.submitting}
        data-testid="btn-blog-publish"
      >
        {form.submitting ? 'Publishing...' : 'Publish Blog'}
      </Button>
      {success && (
        <p
          className="text-green-600 text-center mt-4"
          data-testid="form-success-message"
        >
          Blog submitted successfully!
        </p>
      )}
      {!success && (
        <p
          className="text-red-600 text-center mt-4"
          data-testid="form-error-message"
        >
          {form.errors.root}
        </p>
      )}
    </form>
  );
}
