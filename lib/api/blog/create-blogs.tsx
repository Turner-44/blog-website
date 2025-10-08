'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { z } from 'zod';
import { blogSchema } from '@/utils/zod-schemas';
import { createUIErrorResponse } from '../error-handling/common';

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
  try {
    const validatedFields = blogSchema.safeParse({
      title: data.get('title'),
      slug: data.get('slug'),
      summary: data.get('summary'),
      markdown: data.get('markdown'),
      featureImage: data.get('featureImage'),
      previewImage: data.get('previewImage'),
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

    const {
      title,
      slug,
      summary,
      markdown,
      featureImage,
      previewImage,
      tags,
      publishedAt,
    } = validatedFields.data;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const id = crypto.randomUUID();

    const markdownResponse = await fetch(
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
    );
    if (!markdownResponse.ok) {
      const errorData = await markdownResponse.json().catch(() => ({}));
      console.error('Markdown upload failed:', errorData);
      return createUIErrorResponse(
        `Failed to upload markdown: ${errorData.error || markdownResponse.statusText}`,
        data
      );
    }

    const markdownJson = await markdownResponse.json();

    const featureImageFormData = new FormData();
    featureImageFormData.append('blogId', id);
    featureImageFormData.append('slug', slug);
    featureImageFormData.append('image', featureImage);
    featureImageFormData.append('category', 'feature');

    const featureImageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image`,
      {
        method: 'POST',
        headers: { Cookie: cookieHeader },
        body: featureImageFormData,
      }
    );

    if (!featureImageResponse.ok) {
      const errorData = await featureImageResponse.json().catch(() => ({}));
      console.error('Image upload failed:', errorData);
      return createUIErrorResponse(
        `Failed to upload image: ${errorData.error || featureImageResponse.statusText}`,
        data
      );
    }

    const featureImageJson = await featureImageResponse.json();

    const previewImageFormData = new FormData();
    previewImageFormData.append('blogId', id);
    previewImageFormData.append('slug', slug);
    previewImageFormData.append('image', previewImage);
    previewImageFormData.append('category', 'preview');

    const previewImageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image`,
      {
        method: 'POST',
        headers: { Cookie: cookieHeader },
        body: previewImageFormData,
      }
    );

    if (!previewImageResponse.ok) {
      const errorData = await previewImageResponse.json().catch(() => ({}));
      console.error('Image upload failed:', errorData);
      return createUIErrorResponse(
        `Failed to upload image: ${errorData.error || previewImageResponse.statusText}`,
        data
      );
    }

    const previewImageJson = await previewImageResponse.json();

    const meta = {
      id: id,
      title: title,
      slug: slug,
      summary: summary,
      featureImageKey: featureImageJson.imageKey,
      previewImageKey: previewImageJson.imageKey,
      markdownKey: markdownJson.markdownKey,
      publishedAt: publishedAt,
      tags: tags,
    };

    const metadataResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify(meta),
      }
    );

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json().catch(() => ({}));
      console.error('Metadata save failed:', errorData);

      await Promise.allSettled([
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/markdown?markdownKey=${encodeURIComponent(markdownJson.markdownKey)}`,
          {
            method: 'DELETE',
            headers: { Cookie: cookieHeader },
          }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image?imageKey=${encodeURIComponent(featureImageJson.imageKey)}`,
          {
            method: 'DELETE',
            headers: { Cookie: cookieHeader },
          }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image?imageKey=${encodeURIComponent(previewImageJson.imageKey)}`,
          {
            method: 'DELETE',
            headers: { Cookie: cookieHeader },
          }
        ),
      ]);

      return createUIErrorResponse(
        `Failed to save blog metadata: ${errorData.error || metadataResponse.statusText}`,
        data
      );
    }
    revalidatePath('/');
    revalidatePath('/blog/library');
    revalidatePath(`/blog/${slug}`);
    return {
      success: true,
      message: 'Blog created!',
    };
  } catch (error) {
    console.error('Error creating blog:', error);
    return createUIErrorResponse('An unexpected error occurred.', data);
  }
}
