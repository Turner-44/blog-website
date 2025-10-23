'use client';

import React, { useState } from 'react';
import { CiImageOn } from 'react-icons/ci';
import { FaPaperclip } from 'react-icons/fa6';

import { TextInput, Textarea, FileInput, TagsInput } from '@mantine/core';

import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';

import { Button } from '@/components/shared-components/button';
import { createBlogPost } from '@/lib/api/blog/create-blog.tsx/create-blogs';
import { blogUiFormSchema } from '@/lib/zod';
import { BlogFormData } from '@/types/blog';

export default function CreateBlogForm() {
  const form = useForm<BlogFormData>({
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
      onSubmit={form.onSubmit(
        async (values) => {
          await createBlogPost(values, form, setSuccess);
        },
        () => {
          form.setFieldError('root', 'Please fix the errors above.');
        }
      )}
      className="relative flex flex-col max-w-2xl mx-auto"
      autoComplete="off"
    >
      <TextInput
        label="Title"
        name="title"
        wrapperProps={{ 'data-testid': 'field-blog-title' }}
        data-testid="input-blog-title"
        withAsterisk
        {...form.getInputProps('title')}
      />
      <TextInput
        label="Slug:"
        name="slug"
        wrapperProps={{ 'data-testid': 'field-blog-slug' }}
        data-testid="input-blog-slug"
        withAsterisk
        {...form.getInputProps('slug')}
      />
      <TextInput
        label="Summary:"
        name="summary"
        wrapperProps={{ 'data-testid': 'field-blog-summary' }}
        data-testid="input-blog-summary"
        withAsterisk
        {...form.getInputProps('summary')}
      />
      <Textarea
        label="Markdown:"
        name="markdown"
        wrapperProps={{ 'data-testid': 'field-blog-markdown' }}
        data-testid="input-blog-markdown"
        withAsterisk
        {...form.getInputProps('markdown')}
      />
      <FileInput
        leftSection={<CiImageOn />}
        rightSection={<FaPaperclip />}
        label="Upload Feature Image:"
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
        label="Upload Preview Image:"
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
        label="Tags:"
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
