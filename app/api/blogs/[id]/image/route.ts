import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

import { BUCKET_NAME, s3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import {
  ApiErrorResponse,
  ImageDeleteResponse,
  ImagePostResponse,
} from '@/types/api';
import {
  createErrorResponse,
  genericCatchError,
  validateRequestAgainstSchema,
} from '@/lib/api/error-handling/common';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { createImageSchema, Validations } from '@/utils/zod-schemas';

export async function POST(req: Request) {
  try {
    validateUserSession('API');

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const imageFileType = imageFile?.type?.split('/')[1];
    const imageCategory = (formData.get('category') as string) ?? '';
    const blogId = (formData.get('blogId') as string) ?? '';
    const slug = (formData.get('slug') as string) ?? '';

    const validateSchemaResult = validateRequestAgainstSchema(
      Object.fromEntries(formData.entries()),
      createImageSchema
    );

    if (validateSchemaResult) return validateSchemaResult;

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
        blogId: blogId,
        slug: slug,
        imageKey,
      },
      { status: StatusCodes.CREATED }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    validateUserSession('API');

    const url = new URL(req.url);
    const imageKey = url.searchParams.get('imageKey') ?? '';

    const validateSchemaResult = validateRequestAgainstSchema(
      imageKey,
      Validations.imageKey
    );

    if (validateSchemaResult) return validateSchemaResult;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageKey,
    });

    const s3Res = await s3Client.send(deleteCommand);

    if (s3Res.$metadata.httpStatusCode !== StatusCodes.NO_CONTENT) {
      return NextResponse.json<ApiErrorResponse>(
        createErrorResponse(`Failed to delete image ${imageKey}`),
        { status: s3Res.$metadata.httpStatusCode }
      );
    }

    return NextResponse.json<ImageDeleteResponse>(
      {
        message: 'Image file deleted successfully',
        imageKey,
      },
      { status: StatusCodes.OK }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
