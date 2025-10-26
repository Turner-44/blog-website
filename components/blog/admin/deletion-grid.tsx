'use client';

import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/shared-components/button';
import { deleteCompleteBlogPost } from '@/lib/api/blog/delete-blogs';

export default function DeletionGrid({ blogPosts }: { blogPosts: BlogPost[] }) {
  // eslint-disable-next-line
  const [blogList, setBlogList] = useState<BlogPost[]>(blogPosts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteClick = async (blog: BlogPost, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${blog.title}"? \nThis action CANNOT be undone.`
    );

    if (!confirmDelete) return;

    setIsDeleting(blog.id);

    try {
      await deleteCompleteBlogPost(blog);
      setBlogList((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
    } catch (error) {
      alert(`Failed to delete "${blog.title}". Please try again.`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {blogList.map((blog) => (
        <li
          key={blog.id}
          className="opacity-90 py-3 pt-1"
          data-testid={`row-blog-deletion-grid-${blog.slug}`}
        >
          <article className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-44 md:w-48 aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={`https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blog.featureImageKey}`}
                alt={blog.title || 'Blog image'}
                className=" object-cover object-center rounded-2xl"
                fill
                data-testid={`img-blog-feature-${blog.slug}`}
              />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h2 data-testid={`header-blog-deletion-row-title-${blog.slug}`}>
                {blog.title}
              </h2>
              <p data-testid={`text-blog-deletion-row-summary-${blog.slug}`}>
                {blog.summary}
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <Button
                className="Button-destructive"
                onClick={(e) => handleDeleteClick(blog, e)}
                disabled={isDeleting === blog.id}
                data-testid={`btn-blog-deletion-row-delete-${blog.slug}`}
              >
                {isDeleting === blog.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
