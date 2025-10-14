import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

import { BUCKET_NAME, s3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { ImageResponses } from '@/types/api/image';
import {
  genericCatchError,
  s3ResponseHandler,
  validateRequestAgainstSchema,
} from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { FieldSchemas, createImageSchema } from '@/lib/zod';
import { AWSCacheValue } from '@/lib/api/common/headers';

export async function POST(
  req: Request
): Promise<NextResponse | NextResponse<ImageResponses['Post']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const formData = await req.formData();
    const entries = Object.fromEntries(formData.entries());

    const schemaError = validateRequestAgainstSchema(
      entries,
      createImageSchema
    );
    if (schemaError) return schemaError;

    const imageFile = formData.get('image') as File;
    const fileType = imageFile?.type?.split('/')[1];

    const { blogId, slug, category } = entries as Record<string, string>;

    const imageKey = `blog-posts/${blogId}/images/${slug}-${category}.${fileType}`;

    const s3Res = await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: Buffer.from(await imageFile.arrayBuffer()),
        ContentType: imageFile.type,
        CacheControl: AWSCacheValue,
      })
    );

    const awsError = s3ResponseHandler(s3Res, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to upload image - ${imageKey}`,
    });
    if (awsError) return awsError;

    return NextResponse.json<ImageResponses['Post']>(
      {
        blogId,
        slug,
        imageKey,
      },
      { status: StatusCodes.CREATED }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function DELETE(
  req: Request
): Promise<NextResponse | NextResponse<ImageResponses['Delete']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const imageKey = new URL(req.url).searchParams.get('imageKey') ?? '';

    const schemaError = validateRequestAgainstSchema(
      imageKey,
      FieldSchemas.imageKey
    );
    if (schemaError) return schemaError;

    const s3Res = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageKey,
      })
    );

    const awsError = s3ResponseHandler(s3Res, {
      expectedStatus: StatusCodes.NO_CONTENT,
      errorMessage: `Failed to delete image - ${imageKey}`,
    });
    if (awsError) return awsError;

    return NextResponse.json<ImageResponses['Delete']>(
      {
        message: 'File deleted',
        imageKey,
      },
      { status: StatusCodes.OK }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
