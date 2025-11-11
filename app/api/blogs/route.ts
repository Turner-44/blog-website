import { NextResponse } from 'next/server';

import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

import {
  dynamoDBClient,
  BLOG_POSTS_TABLE_NAME,
  buildAllBlogsQuery,
  dynamoDBResponseErrorCheck,
} from '@/lib/api/aws/dynamo';
import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { BlogsResponses } from '@/types/api/blogs';
import { FieldSchemas, createBlogSchema } from '@/lib/zod';
import { BlogPost } from '@/types/blog';
import {
  genericCatchError,
  validateRequestAgainstSchema,
} from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { NextApiResponse } from '@/types/api/common';
import { createSuccessResponse } from '@/lib/api/common/response-helper';

export async function GET(
  req: Request
): Promise<NextApiResponse | NextApiResponse<BlogsResponses['Get']>> {
  try {
    const url = new URL(req.url);

    const cursor = url.searchParams.get('cursor');

    const startKey = cursor
      ? JSON.parse(Buffer.from(cursor, 'base64').toString())
      : undefined;

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(buildAllBlogsQuery(url, startKey))
    );

    const awsError = dynamoDBResponseErrorCheck(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to retrieve blog posts`,
    });
    if (awsError) return awsError;

    const nextCursor = dynamodbRes.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(dynamodbRes.LastEvaluatedKey)).toString(
          'base64'
        )
      : null;

    return createSuccessResponse(
      {
        blogPosts: (dynamodbRes.Items ?? []) as BlogPost[],
        nextCursor,
      },
      'Retrieved',
      StatusCodes.OK
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function POST(
  req: Request
): Promise<NextApiResponse | NextApiResponse<BlogsResponses['Post']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const reqData = await req.json();

    const schemaError = validateRequestAgainstSchema(reqData, createBlogSchema);
    if (schemaError) return schemaError;

    const id = reqData.id || crypto.randomUUID();

    const blogPost: BlogPost = {
      PK: 'BLOG',
      SK: `${reqData.publishedAt}#${id}`,
      id: id,
      ...reqData,
    };

    const dynamodbRes = await dynamoDBClient.send(
      new PutCommand({
        TableName: BLOG_POSTS_TABLE_NAME,
        Item: blogPost,
      })
    );

    const awsError = dynamoDBResponseErrorCheck(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to create blog post - ${reqData.title}`,
    });
    if (awsError) return awsError;

    return createSuccessResponse(blogPost, 'Created', StatusCodes.CREATED);
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function DELETE(
  req: Request
): Promise<NextApiResponse | NextApiResponse<BlogsResponses['Delete']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const sk = new URL(req.url).searchParams.get('sk') as string;

    const schemaError = validateRequestAgainstSchema(sk, FieldSchemas.sk);
    if (schemaError) return schemaError;

    const dynamodbRes = await dynamoDBClient.send(
      new DeleteItemCommand({
        TableName: BLOG_POSTS_TABLE_NAME,
        Key: {
          PK: { S: 'BLOG' },
          SK: { S: sk },
        },
      })
    );

    const awsError = dynamoDBResponseErrorCheck(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to delete blog post - ${sk}`,
    });
    if (awsError) return awsError;

    return createSuccessResponse(
      {
        PK: 'BLOG',
        SK: sk,
      },
      'Deleted',
      StatusCodes.OK
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
