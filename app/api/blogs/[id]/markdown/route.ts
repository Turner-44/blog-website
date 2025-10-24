import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { BUCKET_NAME, getS3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { MarkdownResponses } from '@/types/api/markdown';
import {
  genericCatchError,
  s3ResponseHandler,
  validateRequestAgainstSchema,
  validateResultsFound as validateResultFound,
  validateResponseStatus,
} from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes';
import { createMarkdownSchema, FieldSchemas } from '@/lib/zod';
import { AWSCacheValue, SevenDayCacheHeader } from '@/lib/api/common/headers';
import { NextApiResponse } from '@/types/api/common';
import { createSuccessResponse } from '@/lib/api/common/response-structures';

export async function GET(
  req: Request
): Promise<NextApiResponse | NextApiResponse<MarkdownResponses['Get']>> {
  try {
    const markdownKey = new URL(req.url).searchParams.get('markdownKey') ?? '';

    const schemaError = validateRequestAgainstSchema(
      markdownKey,
      FieldSchemas.markdownKey
    );
    if (schemaError) return schemaError;

    const s3 = getS3Client();
    const s3Res = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: markdownKey as string,
      })
    );

    const awsError = s3ResponseHandler(s3Res, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to retrieve markdown - ${markdownKey}`,
    });
    if (awsError) return awsError;

    const markdown: string = (await s3Res.Body?.transformToString()) ?? '';

    const notFoundError = validateResultFound(markdown.length > 0);
    if (notFoundError) return notFoundError;

    return createSuccessResponse(
      { markdown },
      'Retrieved',
      StatusCodes.OK,
      SevenDayCacheHeader
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function POST(
  req: Request
): Promise<NextApiResponse | NextApiResponse<MarkdownResponses['Post']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const reqData = await req.json();

    const schemaError = validateRequestAgainstSchema(
      reqData,
      createMarkdownSchema
    );
    if (schemaError) return schemaError;

    const markdownKey = `blog-posts/${reqData.blogId}/content/blog.mdx`;

    const s3 = getS3Client();
    const s3Res = await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: markdownKey,
        Body: reqData.markdown,
        CacheControl: AWSCacheValue,
      })
    );

    const awsError = s3ResponseHandler(s3Res, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to upload markdown - ${reqData.markdownKey}`,
    });
    if (awsError) return awsError;

    return createSuccessResponse(
      {
        blogId: reqData.blogId,
        markdownKey,
      },
      'Uploaded',
      StatusCodes.CREATED
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function DELETE(
  req: Request
): Promise<NextResponse | NextResponse<MarkdownResponses['Delete']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const markdownKey = new URL(req.url).searchParams.get('markdownKey') ?? '';

    const schemaError = validateRequestAgainstSchema(
      markdownKey,
      FieldSchemas.markdownKey
    );
    if (schemaError) return schemaError;

    const s3 = getS3Client();

    const s3Res = await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: markdownKey,
      })
    );

    const awsError = validateResponseStatus(
      s3Res.$metadata.httpStatusCode,
      StatusCodes.NO_CONTENT,
      `Failed to delete markdown - ${markdownKey}`
    );
    if (awsError) return awsError;

    return NextResponse.json<MarkdownResponses['Delete']>(
      {
        message: 'File deleted',
        markdownKey,
      },
      { status: StatusCodes.OK }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
