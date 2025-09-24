'use client';

import Image from 'next/image';

import { BlogMetaData } from '@/types/blog';
import { Button } from '@/components/shared-components/button';

import { deleteBlogPost } from './page';
import { useState } from 'react';

export default function DeleteGrid({ blogs }: { blogs: BlogMetaData[] }) {
    const [blogList, setBlogList] = useState<BlogMetaData[]>(blogs);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDeleteClick = async (
        blog: BlogMetaData,
        e: React.MouseEvent
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${blog.title}"? \nThis action CANNOT be undone.`
        );

        if (!confirmDelete) return;

        setIsDeleting(blog.id);

        try {
            await deleteBlogPost(blog);

            setBlogList((prevBlogs) =>
                prevBlogs.filter((b) => b.id !== blog.id)
            );
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Failed to delete "${blog.title}". Please try again.`);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="p-10">
            <ul className="space-y-4">
                {blogList.map((blog) => (
                    <li key={blog.id} className="max-w-3xl mx-auto">
                        <article className="flex items-center space-x-4 max-w-4xl mx-auto">
                            <div className="w-48 h-32 flex-shrink-0 relative">
                                <Image
                                    src={`https://cdn.becomingmatthew.com/${blog.imageKey}`}
                                    alt={blog.title || 'Blog image'}
                                    className=" object-cover object-center rounded-2xl"
                                    fill
                                />
                            </div>
                            <div className="flex-1 h-32 flex flex-col justify-center space-y-2">
                                <h2 className="text-xl font-semibold">
                                    {blog.title}
                                </h2>
                                <p>{blog.summary}</p>
                            </div>
                            <div>
                                <Button
                                    className="Button-primary"
                                    onClick={(e) => handleDeleteClick(blog, e)}
                                    disabled={isDeleting === blog.id}
                                >
                                    {isDeleting === blog.id
                                        ? 'Deleting...'
                                        : 'Delete'}
                                </Button>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}
