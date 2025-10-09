import { NextResponse } from 'next/server';

import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

import {
  dynamoDBClient,
  TABLE_NAME,
  buildAllBlogsQuery,
  buildBlogBySlugQuery,
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
} from '@/lib/api/error-handling/api';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export async function GET(
  req: Request
): Promise<NextResponse | NextResponse<BlogsResponses['Get']>> {
  try {
    const url = new URL(req.url);

    let queryParams;

    if (url.searchParams.has('slug')) {
      const slug = url.searchParams.get('slug') ?? '';

      const schemaError = validateRequestAgainstSchema(slug, FieldSchemas.slug);
      if (schemaError) return schemaError;

      queryParams = buildBlogBySlugQuery(slug);
    } else {
      queryParams = buildAllBlogsQuery(url);
    }

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(queryParams)
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

    return NextResponse.json<BlogsResponses['Get']>(
      {
        items: dynamodbRes.Items as BlogMetaData[],
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
    validateUserSession('API');

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
      { item },
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
    validateUserSession('API');

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
