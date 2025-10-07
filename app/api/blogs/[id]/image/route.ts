import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

import { BUCKET_NAME, s3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import {
  ApiErrorResponse,
  ImageDeleteResponse,
  ImagePostResponse,
} from '@/types/api';

export async function POST(req: Request) {
  try {
    validateUserSession('API');

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const imageFileType = imageFile?.type?.split('/')[1];
    const imageCategory = formData.get('category') as 'feature' | 'preview';

    if (!imageFile) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    if (imageCategory !== 'feature' && imageCategory !== 'preview') {
      return NextResponse.json<ApiErrorResponse>(
        { error: `${imageCategory} is not a valid image category` },
        { status: 400 }
      );
    }

    const imageKey = `blog-posts/${formData.get('blogId')}/images/${formData.get('slug')}-${imageCategory}.${imageFileType}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: Buffer.from(await imageFile.arrayBuffer()),
        ContentType: imageFile.type,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return NextResponse.json<ImagePostResponse>(
      {
        blogId: formData.get('blogId') as string,
        slug: formData.get('slug') as string,
        imageKey,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('API Error: ', err);
    return NextResponse.json<ApiErrorResponse>(
      { error: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  let imageKey: string | null = null;

  try {
    validateUserSession('API');

    const url = new URL(req.url);
    imageKey = url.searchParams.get('imageKey');

    if (!imageKey) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: `Missing imageKey parameter`,
        },
        { status: 400 }
      );
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageKey,
    });

    const s3Res = await s3Client.send(deleteCommand);

    if (s3Res.$metadata.httpStatusCode !== 204) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Failed to delete image', filePath: imageKey },
        { status: s3Res.$metadata.httpStatusCode }
      );
    }

    return NextResponse.json<ImageDeleteResponse>(
      {
        message: 'Image file deleted successfully',
        imageKey,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('API Error: ', err);
    return NextResponse.json<ApiErrorResponse>(
      { error: String(err), filePath: imageKey },
      { status: 500 }
    );
  }
}
