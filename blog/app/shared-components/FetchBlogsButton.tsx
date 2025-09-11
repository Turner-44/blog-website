'use client'

import { useState } from 'react'
import { Button } from './Button'

export default function FetchBlogsButton() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true)
        try {
            const res = await fetch('/api/blogs?limit=50', {
                cache: 'no-store',
            })
            const { items } = await res.json()

            if (!res.ok) throw new Error('Failed to fetch blogs')

            setBlogs(items)
        } catch (err) {
            console.error(err)
            alert('Error fetching blogs')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Button onClick={handleClick} disabled={loading}>
                {loading ? 'Loading...' : 'Load Blogs'}
            </Button>
            {/* Render blogs if loaded */}
            {blogs.length > 0 && (
                <ul className="list-disc pl-6">
                    {blogs.map((blog) => (
                        <li key={blog.id}>
                            <strong>{blog.title}</strong> – {blog.shortBlurb}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
