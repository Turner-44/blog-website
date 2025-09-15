'use client';

import { formattedDate } from '@/app/lib/utils';
import Link from 'next/link';

export default function BlogCard({ blog }: { blog: any }) {
    return (
        <Link href={`/blog-post/${blog.slug}`} className="no-underline">
            <div
                className="w-90 mx-auto sm:w-96 h-80 bg-black relative rounded-2xl hover:scale-105"
                key={blog.id}
            >
                <div className="aspect-w-1 aspect-h-1 h-full">
                    {blog.image ? (
                        <img
                            src={`data:image/png;base64,${blog.image}`}
                            alt={blog.title || 'Blog image'}
                            className="object-cover object-center rounded-2xl h-full w-full"
                        />
                    ) : (
                        <span className="text-white">No image</span>
                    )}
                </div>
                <div className="absolute h-full w-full top-0 flex flex-col">
                    <div className="flex-1"></div>
                    <div className="flex-1 flex flex-col px-5 py-8 bg-gradient-to-t from-black rounded-2xl">
                        <div className="flex-1"></div>
                        <div>
                            <h1 className="text-xl font-semibold text-white mt-1">
                                {blog.title}
                            </h1>
                        </div>
                        <div className="flex items-center justify-between text-gray-300 text-sm">
                            <h1>{formattedDate(blog.publishedAt)}</h1>
                        </div>
                        <p className="text-sm font text-gray-300 text-md">
                            {blog.summary}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
