'use server';

import { cookies } from 'next/headers';

import { BlogMetaData } from '@/types/blog';
import getBlogs from '@/lib/api/blog/get/get-blogs';
import DeletionGrid from '@/components/blog/admin/deletion-grid';

export const deleteBlogPost = async (blog: BlogMetaData) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
        const markdownRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blog.id}/markdown?markdownKey=${encodeURIComponent(blog.markdownKey)}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
            }
        );

        const imageKeyRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blog.id}/image?imageKey=${encodeURIComponent(blog.imageKey)}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
            }
        );

        const blogDataRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?sk=${encodeURIComponent(blog.SK)}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
            }
        );

        if (markdownRes.ok && imageKeyRes.ok && blogDataRes.ok) {
        } else {
            alert('Failed to delete blog');
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export default async function DeleteBlogPage() {
    return (
        <main className="standard-page-format">
            <DeletionGrid blogs={await getBlogs(30)} />
        </main>
    );
}
