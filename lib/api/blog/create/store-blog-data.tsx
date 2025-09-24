'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { z } from 'zod';
import { blogScheme } from '@/utils/zod-schemas';

type CreateBlogForm = {
    title: string;
    slug: string;
    summary: string;
    markdown: string;
    featureImage: File;
    tags: string[];
    publishedAt?: string;
};

type TreeifiedError = {
    errors: string[];
    properties?: Record<string, { errors: string[] }>;
};

type FormState = {
    success: boolean;
    message: string;
    fieldErrors?: TreeifiedError;
    payload?: FormData;
};

export async function createBlog(
    state: FormState,
    data: FormData
): Promise<FormState> {
    const validatedFields = blogScheme.safeParse({
        title: data.get('title'),
        slug: data.get('slug'),
        summary: data.get('summary'),
        markdown: data.get('markdown'),
        featureImage: data.get('featureImage'),
        tags: (data.get('tags') as string)
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t !== ''),
        publishedAt: data.get('publishedAt'),
    });

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error);

        return {
            success: false,
            message: 'There were validation errors.',
            fieldErrors: z.treeifyError(validatedFields.error),
            payload: data,
        };
    }

    const { title, slug, summary, markdown, featureImage, tags, publishedAt } =
        validatedFields.data;

    // Get cookies to forward to API routes
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const id = crypto.randomUUID();

    const markdownResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/markdown`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader,
            },
            body: JSON.stringify({
                blogId: id,
                markdown,
            }),
        }
    ).then((r) => r.json());

    const imageFormData = new FormData();
    imageFormData.append('blogId', id);
    imageFormData.append('slug', slug);
    imageFormData.append('featureImage', featureImage);

    const imageResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image`,
        {
            method: 'POST',
            headers: { Cookie: cookieHeader },
            body: imageFormData,
        }
    ).then((r) => r.json());

    const publishedAtDateTime =
        publishedAt === undefined || publishedAt === ''
            ? new Date().toISOString()
            : publishedAt + ':00.000Z';

    const meta = {
        id: id,
        title: title,
        slug: slug,
        summary: summary,
        imageKey: imageResp.imageKey,
        markdownKey: markdownResp.markdownKey,
        publishedAt: publishedAtDateTime,
        tags: tags,
    };

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },

        body: JSON.stringify(meta),
    });

    revalidatePath('/');
    revalidatePath('/blog/library');
    revalidatePath(`/blog/${slug}`);
    return {
        success: true,
        message: 'Blog created!',
    };
}
