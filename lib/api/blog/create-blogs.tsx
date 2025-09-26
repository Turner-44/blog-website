'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { z } from 'zod';
import { blogScheme } from '@/utils/zod-schemas';

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
      return {
        success: false,
        message: `Failed to upload markdown: ${errorData.error || markdownResponse.statusText}`,
        payload: data,
      };
    }

    const markdownJson = await markdownResponse.json();

    const imageFormData = new FormData();
    imageFormData.append('blogId', id);
    imageFormData.append('slug', slug);
    imageFormData.append('featureImage', featureImage);

    const imageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image`,
      {
        method: 'POST',
        headers: { Cookie: cookieHeader },
        body: imageFormData,
      }
    );

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json().catch(() => ({}));
      console.error('Image upload failed:', errorData);
      return {
        success: false,
        message: `Failed to upload image: ${errorData.error || imageResponse.statusText}`,
        payload: data,
      };
    }

    const imageJson = await imageResponse.json();

    const publishedAtDateTime =
      publishedAt === undefined || publishedAt === ''
        ? new Date().toISOString()
        : publishedAt + ':00.000Z';

    const meta = {
      id: id,
      title: title,
      slug: slug,
      summary: summary,
      imageKey: imageJson.imageKey,
      markdownKey: markdownJson.markdownKey,
      publishedAt: publishedAtDateTime,
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image?imageKey=${encodeURIComponent(imageJson.imageKey)}`,
          {
            method: 'DELETE',
            headers: { Cookie: cookieHeader },
          }
        ),
      ]);

      return {
        success: false,
        message: `Failed to save blog metadata: ${errorData.error || metadataResponse.statusText}`,
        payload: data,
      };
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
    return {
      success: false,
      message: 'An unexpected error occurred.',
      payload: data,
    };
  }
}
