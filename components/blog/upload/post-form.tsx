'use client';

import Form from 'next/form';
import React from 'react';

import { Button } from '@/components/shared-components/button';
import { createBlog } from '@/lib/api/blog/create/store-blog-data';

export default function CreateBlogForm() {
    const [state, formAction, pending] = React.useActionState(createBlog, {
        success: false,
        message: '',
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
                required
            />
            <input
                name="slug"
                placeholder="Blog Slug"
                className="form-input"
                required
            />
            <input
                name="summary"
                placeholder="Short Blurb"
                className="form-input"
                required
            />
            <textarea
                name="markdown"
                placeholder="Write your blog markdown..."
                className="form-input"
                rows={2}
                required
            />
            <input
                type="file"
                name="featureImage"
                accept="image/*"
                className="form-input"
                required
            />
            <input
                name="tags"
                placeholder="Tag Relevant Topics"
                className="form-input"
                required
            />
            <input
                type="datetime-local"
                name="publishedAt"
                className="form-input"
            />
            <Button
                type="submit"
                className="mt-6 w-32 mx-auto"
                disabled={pending}
            >
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
