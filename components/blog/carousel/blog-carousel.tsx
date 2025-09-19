'use client';

import { useActionState, useState } from 'react';

import { Button } from '@/components/shared-components/button';
import BlogCard from '@/components/blog/carousel/blog-card';

export default function BlogCarousel() {
    const [blogs, setBlogs] = useState<
        Array<{ id: string; image?: string; [key: string]: any }>
    >([]);

    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        try {
            const res = await fetch('/api/blogs?limit=3', {
                cache: 'no-store',
            });

            if (!res.ok) throw new Error('Failed to fetch blogs');
            const { items } = await res.json();

            setBlogs(items);
        } catch (err) {
            console.error(err);
            alert('Error fetching blogs');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Button onClick={handleClick} disabled={loading}>
                {loading ? 'Loading...' : 'Load Blogs'}
            </Button>

            {blogs.length > 0 && (
                <div className="grid grid-cols-3 gap-10 p-5">
                    {blogs.map((blog, index) => {
                        return <BlogCard blog={blog} key={index} />;
                    })}
                </div>
            )}
        </div>
    );
}
