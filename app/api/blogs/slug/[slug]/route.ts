import { NextResponse } from 'next/server';

import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import {
  dynamoDBClient,
  buildBlogByRelativePublishedAtQuery,
  buildBlogBySlugQuery,
} from '@/lib/api/aws/dynamo';
import { FieldSchemas } from '@/lib/zod';
import { BlogPost } from '@/types/blog';
import {
  createErrorResponse,
  dynamoDBResponseHandler,
  genericCatchError,
  validateRequestAgainstSchema,
  validateResultFound,
} from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { SlugResponses } from '@/types/api/blogs-slug';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse | NextResponse<SlugResponses['Get']>> {
  try {
    const { slug } = await params;

    const schemaError = validateRequestAgainstSchema(slug, FieldSchemas.slug);
    if (schemaError) return schemaError;

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(buildBlogBySlugQuery(slug))
    );

    const awsError = dynamoDBResponseHandler(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to retrieve blog posts`,
    });
    if (awsError) return awsError;

    const result = (dynamodbRes.Items ?? []) as BlogPost[];

    const notFoundError = validateResultFound(
      result.length === 1,
      createErrorResponse('No single blog found with the provided slug')
    );
    if (notFoundError) return notFoundError;

    const dynamodbPrevRes = await dynamoDBClient.send(
      new QueryCommand(buildBlogByRelativePublishedAtQuery(result[0], 'before'))
    );

    const dynamodbNextRes = await dynamoDBClient.send(
      new QueryCommand(buildBlogByRelativePublishedAtQuery(result[0], 'after'))
    );

    const prevBlogs = (dynamodbPrevRes.Items ?? []) as BlogPost[];
    const nextBlogs = (dynamodbNextRes.Items ?? []) as BlogPost[];

    return NextResponse.json<SlugResponses['Get']>(
      {
        blogPost: result[0],
        prevBlogPost: prevBlogs[0],
        nextBlogPost: nextBlogs[0],
      },
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
