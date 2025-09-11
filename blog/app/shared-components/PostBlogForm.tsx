'use client'

import { useState } from 'react'
import { Button } from './Button'

export default function CreateBlogForm() {
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const res = await fetch('/api/blogs', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.ok) {
            setSuccess(true)
            ;(event.target as HTMLFormElement).reset()
        } else {
            alert('Failed to submit blog')
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
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
            <input
                name="featureImage"
                placeholder="Feature Image URL"
                className="form-input"
            />
            <input
                name="tags"
                placeholder="Tag Relevant Topics"
                className="form-input"
                required
            />
            <Button type="submit" className="mt-6 w-32 mx-auto">
                Submit
            </Button>
            {success && (
                <p className="text-green-600 text-center mt-4">
                    Blog submitted successfully!
                </p>
            )}
        </form>
    )
}
