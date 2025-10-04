import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb';

import { dynamoDBClient } from '@/lib/api/aws/dynamo';
import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { validateUserSession } from '@/lib/auth/validate-user-session';

const TABLE_NAME = process.env.POSTS_TABLE || 'BlogPosts';

type CreateBlogItem = {
  PK: 'BLOG';
  SK: string;
  id?: string;
  slug: string;
  title: string;
  summary: string;
  imageKey: string;
  markdownKey?: string;
  publishedAt: string;
  tags: string[];
};

const attributes = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  summary: 'summary',
  imageKey: 'imageKey',
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

    if (url.searchParams.get('slug')) {
      const slug = url.searchParams.get('slug');

      if (typeof slug !== 'string') {
        return NextResponse.json(
          { error: 'Blog slug must be a string' },
          { status: 400 }
        );
      }

      if (slug.includes(' ')) {
        return NextResponse.json(
          { error: 'Blog slug must not contain spaces' },
          { status: 400 }
        );
      }

      queryParams = getQueryCommandAttrBySlug(url);
    } else {
      queryParams = getQueryCommandAttr(url);
    }

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(queryParams)
    );

    if (!dynamodbRes.Items) {
      notFound();
    }

    return NextResponse.json(
      {
        items: dynamodbRes.Items,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=31536000, stale-while-revalidate=31536000',
        },
      }
    );
  } catch (err) {
    console.error('API Error: ', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    validateUserSession('API');

    const reqData = await req.json();

    const id = reqData.id || crypto.randomUUID();

    const item: CreateBlogItem = {
      PK: 'BLOG',
      SK: `${reqData.publishedAt}#${id}`,
      id: id,
      title: reqData.title,
      slug: reqData.slug,
      summary: reqData.summary,
      imageKey: reqData.imageKey,
      markdownKey: reqData.markdownKey,
      publishedAt: reqData.publishedAt,
      tags: reqData.tags,
    };

    //TODO: Build out validation

    if (reqData.slug.includes(' ')) {
      return NextResponse.json(
        { error: 'Blog slug must not contain spaces' },
        { status: 400 }
      );
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    const dynamodbRes = await dynamoDBClient.send(command);
    if (!dynamodbRes) {
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        item: item,
        meta: dynamodbRes.ConsumedCapacity,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('API Error: ', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    validateUserSession('API');

    const url = new URL(req.url);

    const sk = url.searchParams.get('sk') as string;

    if (sk === '') {
      return NextResponse.json({ error: 'No SK' }, { status: 404 });
    }

    const deleteCommand = new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: { S: 'BLOG' },
        SK: { S: sk },
      },
    });

    const dynamodbRes = await dynamoDBClient.send(deleteCommand);

    return NextResponse.json(
      {
        meta: dynamodbRes.ConsumedCapacity,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('API Error: ', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
