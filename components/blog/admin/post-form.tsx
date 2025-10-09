'use client';

import Form from 'next/form';
import React from 'react';

import { Button } from '@/components/shared-components/button';
import { createBlog } from '@/lib/api/blog/create-blog.tsx/create-blogs';
import { FormField } from './input-field';
import { FileFormField } from './file-input-field';

export default function CreateBlogForm() {
  const [state, formAction, pending] = React.useActionState(createBlog, {
    success: false,
    message: '',
    fieldErrors: {
      errors: [],
      properties: {},
    },
  });

  const [inputs, setInputs] = React.useState({
    title: '',
    slug: '',
    summary: '',
    markdown: '',
    featureImage: null as File | null,
    previewImage: null as File | null,
    tags: '',
    publishedAt: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setInputs((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, value ?? '');
    });

    await formAction(formData);
  };

  React.useEffect(() => {
    if (state.success) {
      setInputs({
        title: '',
        slug: '',
        summary: '',
        markdown: '',
        featureImage: null,
        previewImage: null,
        tags: '',
        publishedAt: '',
      });
    }
  }, [state.success]);

  return (
    <Form action={handleSubmit} className="flex flex-col rounded min-w-md">
      <FormField
        label="Blog Title:"
        name="title"
        value={inputs.title}
        onChange={handleChange}
        errors={state.fieldErrors?.properties?.title?.errors[0]}
        testId="input-blog-title"
        type="text"
      />
      <FormField
        label="Blog Slug:"
        name="slug"
        value={inputs.slug}
        onChange={handleChange}
        errors={state.fieldErrors?.properties?.slug?.errors[0]}
        testId="input-blog-slug"
        type="text"
      />
      <FormField
        label="Blog Summary:"
        name="summary"
        value={inputs.summary}
        onChange={handleChange}
        errors={state.fieldErrors?.properties?.summary?.errors[0]}
        testId="input-blog-summary"
        type="text"
      />
      <FormField
        label="Blog Content:"
        name="markdown"
        value={inputs.markdown}
        onChange={handleChange}
        errors={state.fieldErrors?.properties?.markdown?.errors[0]}
        testId="input-blog-markdown"
        type="textarea"
      />
      <FileFormField
        label="Feature Image:"
        name="featureImage"
        value={inputs.featureImage}
        onChange={handleFileChange}
        errors={state.fieldErrors?.properties?.featureImage?.errors[0]}
        testId="input-blog-feature-image"
      />
      <FileFormField
        label="Preview Image:"
        name="previewImage"
        value={inputs.previewImage}
        onChange={handleFileChange}
        errors={state.fieldErrors?.properties?.previewImage?.errors[0]}
        testId="input-blog-preview-image"
      />
      <FormField
        label="Blog Tags:"
        name="tags"
        value={inputs.tags}
        onChange={handleChange}
        errors={state.fieldErrors?.properties?.tags?.errors[0]}
        testId="input-blog-tags"
        type="text"
      />
      <FormField
        label="Publish Date:"
        name="publishedAt"
        value={inputs.publishedAt}
        onChange={handleChange}
        errors={state.fieldErrors?.properties?.publishedAt?.errors[0]}
        testId="input-blog-publishedAt"
        type="datetime-local"
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
