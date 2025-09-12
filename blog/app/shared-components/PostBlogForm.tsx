'use client'

import { useState } from 'react'
import { Button } from './Button'
import Form from 'next/form'
import createBlog from '@/app/api/blogs/create-blog'

export default function CreateBlogForm() {
    const [success, setSuccess] = useState(false)
    return (
        <Form
            action={createBlog}
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
                name="shortBlurb"
                placeholder="Short Blurb"
                className="form-input"
                required
            />
            <textarea
                name="markdownContent"
                placeholder="Write your blog markdown..."
                rows={10}
                required
            />
            <input type="file" name="featureImage" accept="image/*" required />
            <input
                name="tags"
                placeholder="Tag Relevant Topics"
                className="form-input"
                required
            />
            <Button type="submit" className="mt-6 w-32 mx-auto">
                Create Blog
            </Button>
            {success && (
                <p className="text-green-600 text-center mt-4">
                    Blog submitted successfully!
                </p>
            )}
        </Form>
    )
}
