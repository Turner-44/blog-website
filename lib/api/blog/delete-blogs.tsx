'use server';

import { cookies } from 'next/headers';
import { BlogMetaData } from '@/types/blog';

export async function deleteBlogPost(blog: BlogMetaData) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const [markdownRes, imageKeyRes, blogDataRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blog.id}/markdown?markdownKey=${encodeURIComponent(blog.markdownKey)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blog.id}/image?imageKey=${encodeURIComponent(blog.featureImageKey)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blog.id}/image?imageKey=${encodeURIComponent(blog.previewImageKey)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?sk=${encodeURIComponent(blog.SK)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
        }
      ),
    ]);

    if (!markdownRes.ok || !imageKeyRes.ok || !blogDataRes.ok) {
      throw new Error('Failed to delete one or more blog components');
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}
