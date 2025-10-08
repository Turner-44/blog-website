import { NextResponse } from 'next/server';

import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb';

import { dynamoDBClient } from '@/lib/api/aws/dynamo';
import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import {
  ApiErrorResponse,
  BlogsDeleteResponse,
  BlogsGetResponse,
  BlogsPostResponse,
  BlogsResponseItem,
} from '@/types/api';
import { Validations, createBlogSchema } from '@/utils/zod-schemas';
import { BlogMetaData } from '@/types/blog';
import {
  createErrorResponse,
  dynamoDBResponseHandler,
  genericCatchError,
  validateRequestAgainstSchema,
  validateResultFound,
} from '@/lib/api/error-handling/common';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

const TABLE_NAME = process.env.POSTS_TABLE || 'BlogPosts';

const attributes = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  summary: 'summary',
  featureImageKey: 'featureImageKey',
  previewImageKey: 'previewImageKey',
  markdownKey: 'markdownKey',
  publishedAt: 'publishedAt',
  tags: 'tags',
  SK: 'SK',
};

const getQueryCommandAttr = (url: URL): QueryCommandInput => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: '#pk = :blog',
  ExpressionAttributeNames: { '#pk': 'PK' },
  ExpressionAttributeValues: { ':blog': 'BLOG' },
  ScanIndexForward: false,
  Limit: Number(url.searchParams.get('limit')) ?? 50,
  ProjectionExpression: Object.values(attributes).join(', '),
});

const getQueryCommandAttrBySlug = (url: URL): QueryCommandInput => ({
  TableName: TABLE_NAME,
  IndexName: 'slug-index',
  KeyConditionExpression: 'slug = :slug',
  ExpressionAttributeValues: {
    ':slug': `${url.searchParams.get('slug')}`,
  },
  ProjectionExpression: Object.values(attributes).join(', '),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    let queryParams;

    if (url.searchParams.has('slug')) {
      const slug = url.searchParams.get('slug') ?? '';
      const validateResult = validateRequestAgainstSchema(
        slug,
        Validations.slug
      );

      if (validateResult) return validateResult;

      queryParams = getQueryCommandAttrBySlug(url);
    } else {
      queryParams = getQueryCommandAttr(url);
    }

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(queryParams)
    );

    const validateResult = validateResultFound(
      (dynamodbRes.Items ?? []).length > 0
    );
    if (validateResult) return validateResult;

    return NextResponse.json<BlogsGetResponse>(
      {
        items: dynamodbRes.Items as BlogsResponseItem[],
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

export async function POST(req: Request) {
  try {
    validateUserSession('API');

    const reqData = await req.json();

    const validateSchemaResult = validateRequestAgainstSchema(
      reqData,
      createBlogSchema
    );

    if (validateSchemaResult) return validateSchemaResult;

    const id = reqData.id || crypto.randomUUID();

    const item: BlogMetaData = {
      PK: 'BLOG',
      SK: `${reqData.publishedAt}#${id}`,
      id: id,
      title: reqData.title,
      slug: reqData.slug,
      summary: reqData.summary,
      featureImageKey: reqData.featureImageKey,
      previewImageKey: reqData.previewImageKey,
      markdownKey: reqData.markdownKey,
      publishedAt: reqData.publishedAt,
      tags: reqData.tags,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    const dynamodbRes = await dynamoDBClient.send(command);

    const validateResult = dynamoDBResponseHandler(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
    });

    if (validateResult) return validateResult;

    return NextResponse.json<BlogsPostResponse>(
      {
        item: item as BlogsResponseItem,
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

    const sk = url.searchParams.get('sk') as string;

    if (sk === '') {
      return NextResponse.json<ApiErrorResponse>(createErrorResponse('No SK'), {
        status: 404,
      });
    }

    const deleteCommand = new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: { S: 'BLOG' },
        SK: { S: sk },
      },
    });

    const dynamodbRes = await dynamoDBClient.send(deleteCommand);

    if (dynamodbRes.$metadata.httpStatusCode !== StatusCodes.NO_CONTENT) {
      return NextResponse.json<ApiErrorResponse>(
        createErrorResponse('Failed to delete blog post'),
        { status: dynamodbRes.$metadata.httpStatusCode }
      );
    }

    return NextResponse.json<BlogsDeleteResponse>(
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
