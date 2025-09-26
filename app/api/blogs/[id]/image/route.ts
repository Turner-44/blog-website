import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

import { BUCKET_NAME, s3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';

export async function POST(req: Request) {
  try {
    validateUserSession('API');

    const formData = await req.formData();
    const imageFile = formData.get('featureImage') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Feature image is required' },
        { status: 400 }
      );
    }

    const imageKey = `blog-posts/${formData.get('blogId')}/images/${formData.get('slug')}.png`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: Buffer.from(await imageFile.arrayBuffer()),
        ContentType: imageFile.type,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return NextResponse.json(
      {
        blogId: formData.get('blogId'),
        slug: formData.get('slug'),
        imageKey,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('API Error: ', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  let imageKey: string | null = null;

  try {
    validateUserSession('API');

    const url = new URL(req.url);
    imageKey = url.searchParams.get('imageKey');

    if (!imageKey) {
      return NextResponse.json(
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

    await s3Client.send(deleteCommand); //TODO Add error handling

    return NextResponse.json(
      {
        message: 'Image file deleted successfully',
        imageKey,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('API Error: ', err);
    return NextResponse.json(
      { error: String(err), filePath: imageKey },
      { status: 500 }
    );
  }
}
