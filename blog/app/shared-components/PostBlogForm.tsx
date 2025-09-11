'use client'

import { Button } from './Button'

export default function CreateBlogForm() {
    return (
        <form
            action="/api/blogs"
            method="post"
            className="flex flex-col gap-2 p-4 rounded min-w-md"
        >
            <input
                name="title"
                placeholder="Blog Title"
                className="form-input"
            />
            <input name="slug" placeholder="Blog Slug" className="form-input" />
            <input
                name="shortBlurb"
                placeholder="Short Blurb"
                className="form-input"
            />
            <input
                name="featureImage"
                placeholder="Feature Image URL"
                className="form-input"
            />
            <input
                name="tags"
                placeholder="Tag Relevant Topics"
                className="form-input"
            />
            <Button type="submit" className="mt-6 w-32 mx-auto">
                Submit
            </Button>
        </form>
    )
}
