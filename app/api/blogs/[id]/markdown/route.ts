import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { BUCKET_NAME, s3Client } from '@/lib/api/aws/s3';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import {
  ApiErrorResponse,
  MarkdownDeleteResponse,
  MarkdownPostResponse,
  MarkdownGetResponse,
} from '@/types/api';
import {
  createErrorResponse,
  genericCatchError,
  s3ResponseHandler,
  validateRequestAgainstSchema,
  validateResultFound,
} from '@/lib/api/error-handling/common';
import { StatusCodes } from 'http-status-codes';
import { createMarkdownSchema, Validations } from '@/utils/zod-schemas';

export async function POST(req: Request) {
  try {
    validateUserSession('API');

    const reqData = await req.json();
    const markdown = reqData.markdown;

    const validateSchemaResult = validateRequestAgainstSchema(
      reqData,
      createMarkdownSchema
    );

    if (validateSchemaResult) return validateSchemaResult;

    const markdownKey = `blog-posts/${reqData.blogId}/content/blog.mdx`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: markdownKey,
        Body: markdown,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return NextResponse.json<MarkdownPostResponse>(
      {
        blogId: reqData.blogId,
        markdownKey,
      },
      { status: 201 }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const markdownKey = url.searchParams.get('markdownKey');

    const validateResult = validateRequestAgainstSchema(
      markdownKey,
      Validations.markdownKey
    );

    if (validateResult) return validateResult;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: markdownKey as string,
    });

    const s3Res = await s3Client.send(command);
    s3ResponseHandler(s3Res, { expectedStatus: StatusCodes.OK });

    const markdown: string = (await s3Res.Body?.transformToString()) ?? '';
    validateResultFound(markdown, createErrorResponse('Markdown not found'));

    return NextResponse.json<MarkdownGetResponse>(
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

export async function DELETE(req: Request) {
  let markdownKey: string | null = null;

  try {
    validateUserSession('API');

    const url = new URL(req.url);
    markdownKey = url.searchParams.get('markdownKey') ?? '';

    const validateResult = validateRequestAgainstSchema(
      markdownKey,
      Validations.markdownKey
    );

    if (validateResult) return validateResult;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: markdownKey,
    });

    const s3Res = await s3Client.send(deleteCommand);

    if (s3Res.$metadata.httpStatusCode !== StatusCodes.NO_CONTENT) {
      return NextResponse.json<ApiErrorResponse>(
        createErrorResponse(`Failed to delete markdown - ${markdownKey}`),
        { status: s3Res.$metadata.httpStatusCode }
      );
    }

    return NextResponse.json<MarkdownDeleteResponse>(
      {
        message: 'Markdown file deleted successfully',
        markdownKey,
      },
      { status: StatusCodes.OK }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
