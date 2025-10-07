'use client';

import { BlogMetaData } from '@/types/blog';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/shared-components/button';
import { deleteBlogPost } from '@/lib/api/blog/delete-blogs';

export default function DeletionGrid({ blogs }: { blogs: BlogMetaData[] }) {
  // eslint-disable-next-line
  const [blogList, setBlogList] = useState<BlogMetaData[]>(blogs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteClick = async (blog: BlogMetaData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${blog.title}"? \nThis action CANNOT be undone.`
    );

    if (!confirmDelete) return;

    setIsDeleting(blog.id);

    try {
      await deleteBlogPost(blog);
      setBlogList((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete "${blog.title}". Please try again.`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <ul className="space-y-4 ">
      {blogList.map((blog) => (
        <li
          key={blog.id}
          className="py-1"
          data-testid={`row-blog-deletion-grid-${blog.slug}`}
        >
          <article className="flex items-center space-x-4 gap-2">
            <div className="w-48 h-32 flex-shrink-0 relative">
              <Image
                src={`https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blog.featureImageKey}`}
                alt={blog.title || 'Blog image'}
                className=" object-cover object-center rounded-2xl"
                fill
                data-testid={`img-blog-feature-${blog.slug}`}
              />
            </div>
            <div className="flex-1 h-32 flex flex-col justify-center space-y-2">
              <h2 data-testid={`header-blog-deletion-row-title-${blog.slug}`}>
                {blog.title}
              </h2>
              <p
                className="text-justify"
                data-testid={`text-blog-deletion-row-summary-${blog.slug}`}
              >
                {blog.summary}
              </p>
            </div>
            <div>
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
