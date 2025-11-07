'use client';

import Link from 'next/link';
import Image from 'next/image';

import { BlogPost } from '@/types/blog';
import { useState } from 'react';
import { getBlogList } from '@/lib/api/blog/get-blogs';
import { Button } from '@/components/shared-components/button';

export default function BlogGrid({
  initialBlogs,
  initialCursor,
}: {
  initialBlogs: BlogPost[];
  initialCursor?: string | null;
}) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!cursor) return;
    setLoading(true);

    const { blogPosts: newBlogs, nextCursor } = await getBlogList(10, cursor);
    setBlogs((prev) => [...prev, ...newBlogs]);
    setCursor(nextCursor);

    setLoading(false);
  };
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {blogs.map((blog) => (
        <li
          key={blog.id}
          className="hover:scale-105 opacity-90 py-5 px-5 -mt-2"
        >
          <Link href={`/blog/${blog.slug}`}>
            <div className="flex flex-col sm:flex-row gap-10 pl-5 items-center">
              <div className="flex-1 relative w-72 aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={`https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blog.featureImageKey}`}
                  alt={blog.title || 'Blog image'}
                  className=" object-cover object-center rounded-2xl"
                  fill
                />
              </div>
              <div className="flex-2">
                <h3>{blog.title}</h3>
                <p>{blog.summary}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
      {cursor && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Load More'}
          </Button>
        </div>
      )}
    </ul>
  );
}
