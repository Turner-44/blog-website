import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import {
  dynamoDBClient,
  buildBlogByRelativePublishedAtQuery,
  buildBlogBySlugQuery,
} from '@/lib/api/aws/dynamo';
import { FieldSchemas } from '@/lib/zod';
import { BlogPost } from '@/types/blog';
import {
  dynamoDBResponseHandler,
  genericCatchError,
  validateRequestAgainstSchema,
  validateResultsFound,
} from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { SlugResponses } from '@/types/api/blogs-slug';
import { NextApiResponse } from '@/types/api/common';
import { createSuccessResponse } from '@/lib/api/common/response-structures';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextApiResponse | NextApiResponse<SlugResponses['Get']>> {
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

    const notFoundError = validateResultsFound(result.length === 1);
    if (notFoundError) return notFoundError;

    const dynamodbPrevRes = await dynamoDBClient.send(
      new QueryCommand(buildBlogByRelativePublishedAtQuery(result[0], 'before'))
    );

    const dynamodbNextRes = await dynamoDBClient.send(
      new QueryCommand(buildBlogByRelativePublishedAtQuery(result[0], 'after'))
    );

    const prevBlogs = (dynamodbPrevRes.Items ?? []) as BlogPost[];
    const nextBlogs = (dynamodbNextRes.Items ?? []) as BlogPost[];

    return createSuccessResponse(
      {
        blogPost: result[0],
        prevBlogPost: prevBlogs[0],
        nextBlogPost: nextBlogs[0],
      },
      'Retrieved',
      StatusCodes.OK
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
