'use client';

import Form from 'next/form';
import React from 'react';

import { Button } from '@/components/shared-components/button';
import { createBlog } from '@/lib/api/blog/create/store-blog-data';

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
            className="flex flex-col gap-2 p-4 rounded min-w-md"
        >
            <input
                name="title"
                placeholder="Blog Title"
                className="form-input"
                defaultValue={state.payload?.get('title') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.title?.errors[0]}
            </span>
            <input
                name="slug"
                placeholder="Blog Slug"
                className="form-input"
                defaultValue={state.payload?.get('slug') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.slug?.errors[0]}
            </span>
            <input
                name="summary"
                placeholder="Short Blurb"
                className="form-input"
                defaultValue={state.payload?.get('summary') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.summary?.errors[0]}
            </span>
            <textarea
                name="markdown"
                placeholder="Write your blog markdown..."
                className="form-input"
                rows={2}
                defaultValue={state.payload?.get('markdown') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.markdown?.errors[0]}
            </span>
            <input
                type="file"
                name="featureImage"
                accept="image/*"
                className="form-input"
                defaultValue={state.payload?.get('featureImage') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.featureImage?.errors[0]}
            </span>
            <input
                name="tags"
                placeholder="Tag Relevant Topics"
                className="form-input"
                defaultValue={state.payload?.get('tags') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.tags?.errors[0]}
            </span>
            <input
                type="datetime-local"
                name="publishedAt"
                className="form-input"
                defaultValue={state.payload?.get('publishedAt') as string}
            />
            <span className="form-error-text">
                {state.fieldErrors?.properties?.publishedAt?.errors[0]}
            </span>
            <Button type="submit" className="Button-primary" disabled={pending}>
                {pending ? 'Creating...' : 'Create Blog'}
            </Button>
            {state.success && (
                <p className="text-green-600 text-center mt-4">
                    Blog submitted successfully!
                </p>
            )}
        </Form>
    );
}
