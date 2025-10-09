'use client';

import Form from 'next/form';
import React from 'react';

import { Button } from '@/components/shared-components/button';
import { createBlog } from '@/lib/api/blog/create-blogs';

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
    <Form
      action={formAction}
      className="flex flex-col gap-1 p-4 rounded min-w-md"
    >
      <label htmlFor="title">Blog Title:</label>
      <input
        name="title"
        className="form-input"
        defaultValue={state.payload?.get('title') as string}
        data-testid="input-blog-title"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.title?.errors[0]}
      </span>
      <label htmlFor="slug">Blog Slug:</label>
      <input
        name="slug"
        className="form-input"
        defaultValue={state.payload?.get('slug') as string}
        data-testid="input-blog-slug"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.slug?.errors[0]}
      </span>
      <label htmlFor="summary">Blog Summary:</label>
      <input
        name="summary"
        placeholder="A short summary of the blog"
        className="form-input"
        defaultValue={state.payload?.get('summary') as string}
        data-testid="input-blog-summary"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.summary?.errors[0]}
      </span>
      <label htmlFor="markdown">Blog Content:</label>
      <textarea
        name="markdown"
        placeholder="Blog Written In Markdown (MDX) Format"
        className="form-input"
        rows={2}
        defaultValue={state.payload?.get('markdown') as string}
        data-testid="input-blog-markdown"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.markdown?.errors[0]}
      </span>
      <label htmlFor="featureImage">Feature Image:</label>
      <input
        type="file"
        name="featureImage"
        accept="image/*"
        className="form-input"
        defaultValue={state.payload?.get('featureImage') as string}
        data-testid="input-blog-feature-image"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.featureImage?.errors[0]}
      </span>
      <label htmlFor="previewImage">Preview Image:</label>
      <input
        placeholder="Select A Preview Image"
        type="file"
        name="previewImage"
        accept="image/*"
        className="form-input"
        defaultValue={state.payload?.get('previewImage') as string}
        data-testid="input-blog-preview-image"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.previewImage?.errors[0]}
      </span>
      <label htmlFor="tags">Blog Tags:</label>
      <input
        name="tags"
        placeholder="Tag Relevant Topics"
        className="form-input"
        defaultValue={state.payload?.get('tags') as string}
        data-testid="input-blog-tags"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.tags?.errors[0]}
      </span>
      <label htmlFor="publishedAt">Publish Date:</label>
      <input
        type="datetime-local"
        name="publishedAt"
        className="form-input"
        defaultValue={state.payload?.get('publishedAt') as string}
        data-testid="input-blog-publishedAt-date"
      />
      <span className="form-error-text">
        {state.fieldErrors?.properties?.publishedAt?.errors[0]}
      </span>
      <Button
        type="submit"
        className="Button-primary"
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
