'use client';

import Form from 'next/form';
import React from 'react';

import { Button } from '@/components/shared-components/button';
import { createBlog } from '@/lib/api/blog/create-blogs';
import { FormField } from './input-field';

export default function CreateBlogForm() {
  const [state, formAction, pending] = React.useActionState(createBlog, {
    success: false,
    message: '',
    fieldErrors: {
      errors: [],
      properties: {},
    },
    payload: new FormData(),
  });

  return (
    <Form action={formAction} className="flex flex-col rounded min-w-md">
      <FormField
        label="Blog Title:"
        name="title"
        defaultValue={state.payload?.get('title') as string}
        errors={state.fieldErrors?.properties?.title?.errors[0]}
        testId="input-blog-title"
      />
      <FormField
        label="Blog Slug:"
        name="slug"
        defaultValue={state.payload?.get('slug') as string}
        errors={state.fieldErrors?.properties?.slug?.errors[0]}
        testId="input-blog-slug"
      />
      <FormField
        label="Blog Summary:"
        name="summary"
        defaultValue={state.payload?.get('summary') as string}
        errors={state.fieldErrors?.properties?.summary?.errors[0]}
        testId="input-blog-summary"
      />
      <FormField
        label="Blog Content:"
        name="markdown"
        defaultValue={state.payload?.get('markdown') as string}
        errors={state.fieldErrors?.properties?.markdown?.errors[0]}
        testId="input-blog-markdown"
      />
      <FormField
        label="Feature Image:"
        name="featureImage"
        defaultValue={state.payload?.get('featureImage') as string}
        errors={state.fieldErrors?.properties?.featureImage?.errors[0]}
        testId="input-blog-feature-image"
      />
      <FormField
        label="Preview Image:"
        name="previewImage"
        defaultValue={state.payload?.get('previewImage') as string}
        errors={state.fieldErrors?.properties?.previewImage?.errors[0]}
        testId="input-blog-preview-image"
      />
      <FormField
        label="Blog Tags:"
        name="tags"
        defaultValue={state.payload?.get('tags') as string}
        errors={state.fieldErrors?.properties?.tags?.errors[0]}
        testId="input-blog-tags"
      />
      <FormField
        label="Publish Date:"
        name="publishedAt"
        defaultValue={state.payload?.get('publishedAt') as string}
        errors={state.fieldErrors?.properties?.publishedAt?.errors[0]}
        testId="input-blog-publishedAt"
      />
      <Button
        type="submit"
        className="Button-primary mt-4"
        disabled={pending}
        data-testid="btn-blog-publish"
      >
        {pending ? 'Publishing...' : 'Publish Blog'}
      </Button>
      {state.success && (
        <p className="text-green-600 text-center mt-4">
          Blog submitted successfully!
        </p>
      )}
      {!state.success && (
        <p className="text-red-600 text-center mt-4">{state.message}</p>
      )}
    </Form>
  );
}
