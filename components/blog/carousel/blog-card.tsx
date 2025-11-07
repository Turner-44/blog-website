import Link from 'next/link';
import Image from 'next/image';

import { formattedDate as formatDate } from '@/utils/dates';
import { BlogPost } from '@/types/blog';

export default function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="no-underline">
      <div
        className="mx-auto relative w-92 h-60 bg-black rounded-2xl hover:scale-105 shadow-lg"
        key={blog.id}
        data-testid={`blog-card-${blog.slug}`}
      >
        <div>
          <Image
            src={`https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blog.previewImageKey}`}
            alt={blog.title || 'Blog image'}
            className="object-cover rounded-2xl"
            fill
            data-testid={`img-blog-feature-${blog.slug}`}
          />
        </div>
        <div className="absolute h-full w-full top-0 flex flex-col">
          <div className="flex-1" />
          <div className="flex-1 flex flex-col px-5 py-3 bg-gradient-to-t from-black rounded-2xl">
            <div className="flex-1" />
            <div>
              <h2
                className="text-white"
                data-testid={`header-blog-card-title-${blog.slug}`}
              >
                {blog.title}
              </h2>
            </div>
            <div className="py-1 text-gray-300 text-sm">
              <p
                className="font-bold mb-1"
                data-testid={`text-blog-card-publishedAt-date-${blog.slug}`}
              >
                {formatDate(blog.publishedAt)}
              </p>

              <p
                className="font-normal"
                data-testid={`text-blog-card-summary-${blog.slug}`}
              >
                {blog.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
