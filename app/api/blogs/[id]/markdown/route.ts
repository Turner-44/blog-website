import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { BUCKET_NAME, s3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { MarkdownResponses } from '@/types/api/markdown';
import {
  createErrorResponse,
  genericCatchError,
  s3ResponseHandler,
  validateRequestAgainstSchema,
  validateResultFound,
  validateResponse,
} from '@/lib/api/error-handling/common';
import { StatusCodes } from 'http-status-codes';
import { createMarkdownSchema, Validations } from '@/utils/zod-schemas';

export async function GET(
  req: Request
): Promise<NextResponse | NextResponse<MarkdownResponses['Get']>> {
  try {
    const markdownKey = new URL(req.url).searchParams.get('markdownKey') ?? '';

    const schemaError = validateRequestAgainstSchema(
      markdownKey,
      Validations.markdownKey
    );
    if (schemaError) return schemaError;

    const s3Res = await s3Client.send(
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

    const notFoundError = validateResultFound(
      markdown,
      createErrorResponse('Markdown not found')
    );
    if (notFoundError) return notFoundError;

    return NextResponse.json<MarkdownResponses['Get']>(
      { markdown },
      {
        status: StatusCodes.OK,
        headers: {
          'Cache-Control': 's-maxage=31536000, stale-while-revalidate=31536000',
        },
      }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function POST(
  req: Request
): Promise<NextResponse | NextResponse<MarkdownResponses['Post']>> {
  try {
    validateUserSession('API');

    const reqData = await req.json();

    const schemaError = validateRequestAgainstSchema(
      reqData,
      createMarkdownSchema
    );
    if (schemaError) return schemaError;

    const markdownKey = `blog-posts/${reqData.blogId}/content/blog.mdx`;

    const s3Res = await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: markdownKey,
        Body: reqData.markdown,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const awsError = s3ResponseHandler(s3Res, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to upload markdown - ${reqData.markdownKey}`,
    });
    if (awsError) return awsError;

    return NextResponse.json<MarkdownResponses['Post']>(
      {
        blogId: reqData.blogId,
        markdownKey,
      },
      { status: StatusCodes.CREATED }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function DELETE(
  req: Request
): Promise<NextResponse | NextResponse<MarkdownResponses['Delete']>> {
  try {
    validateUserSession('API');

    const markdownKey = new URL(req.url).searchParams.get('markdownKey') ?? '';

    const schemaError = validateRequestAgainstSchema(
      markdownKey,
      Validations.markdownKey
    );
    if (schemaError) return schemaError;

    const s3Res = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: markdownKey,
      })
    );

    const awsError = validateResponse(
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
