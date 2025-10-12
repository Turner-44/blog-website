import { NextResponse } from 'next/server';

import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

import {
  dynamoDBClient,
  TABLE_NAME,
  buildAllBlogsQuery,
} from '@/lib/api/aws/dynamo';
import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { BlogsResponses } from '@/types/api/blogs';
import { FieldSchemas, createBlogSchema } from '@/lib/zod';
import { BlogMetaData } from '@/types/blog';
import {
  dynamoDBResponseHandler,
  genericCatchError,
  validateRequestAgainstSchema,
  validateResultFound,
} from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export async function GET(
  req: Request
): Promise<NextResponse | NextResponse<BlogsResponses['Get']>> {
  try {
    const url = new URL(req.url);

    const cursor = url.searchParams.get('cursor');

    const startKey = cursor
      ? JSON.parse(Buffer.from(cursor, 'base64').toString())
      : undefined;

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(buildAllBlogsQuery(url, startKey))
    );

    const awsError = dynamoDBResponseHandler(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to retrieve blog posts`,
    });
    if (awsError) return awsError;

    const notFoundError = validateResultFound(
      (dynamodbRes.Items ?? []).length > 0
    );
    if (notFoundError) return notFoundError;

    const nextCursor = dynamodbRes.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(dynamodbRes.LastEvaluatedKey)).toString(
          'base64'
        )
      : null;

    return NextResponse.json<BlogsResponses['Get']>(
      {
        blogPosts: dynamodbRes.Items as BlogMetaData[],
        nextCursor,
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

export async function POST(
  req: Request
): Promise<NextResponse | NextResponse<BlogsResponses['Post']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const reqData = await req.json();

    const schemaError = validateRequestAgainstSchema(reqData, createBlogSchema);
    if (schemaError) return schemaError;

    const id = reqData.id || crypto.randomUUID();

    const item: BlogMetaData = {
      PK: 'BLOG',
      SK: `${reqData.publishedAt}#${id}`,
      id: id,
      ...reqData,
    };

    const dynamodbRes = await dynamoDBClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    const awsError = dynamoDBResponseHandler(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to create blog post - ${reqData.title}`,
    });
    if (awsError) return awsError;

    return NextResponse.json<BlogsResponses['Post']>(
      { blogPost: item },
      { status: StatusCodes.CREATED }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function DELETE(
  req: Request
): Promise<NextResponse | NextResponse<BlogsResponses['Delete']>> {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const sk = new URL(req.url).searchParams.get('sk') as string;

    const schemaError = validateRequestAgainstSchema(sk, FieldSchemas.sk);
    if (schemaError) return schemaError;

    const dynamodbRes = await dynamoDBClient.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: { S: 'BLOG' },
          SK: { S: sk },
        },
      })
    );

    const awsError = dynamoDBResponseHandler(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to delete blog post - ${sk}`,
    });
    if (awsError) return awsError;

    return NextResponse.json<BlogsResponses['Delete']>(
      {
        message: 'Blog was deleted',
        PK: 'BLOG',
        SK: sk,
      },
      { status: StatusCodes.OK }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
