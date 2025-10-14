import { BlogPost } from '@/types/blog';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS as string,
  },
});

export const dynamoDBClient = DynamoDBDocumentClient.from(dbClient);

export const TABLE_NAME = process.env.POSTS_TABLE || 'BlogPosts';

export const BLOG_PK = 'BLOG';

const BASE_ATTRIBUTES = [
  'id',
  'slug',
  'title',
  'summary',
  'featureImageKey',
  'previewImageKey',
  'markdownKey',
  'publishedAt',
  'tags',
  'SK',
];

const projectionExpression = BASE_ATTRIBUTES.join(', ');

export const buildAllBlogsQuery = (
  url: URL,
  startKey: Record<string, string> | undefined
): QueryCommandInput => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: '#pk = :pk',
  ExpressionAttributeNames: { '#pk': 'PK' },
  ExpressionAttributeValues: { ':pk': BLOG_PK },
  ProjectionExpression: projectionExpression,
  Limit: Number(url.searchParams.get('limit') ?? 50),
  ExclusiveStartKey: startKey,
  ScanIndexForward: false,
});

export const buildBlogBySlugQuery = (slug: string): QueryCommandInput => ({
  TableName: TABLE_NAME,
  IndexName: 'slug-index',
  KeyConditionExpression: 'slug = :slug',
  ExpressionAttributeValues: { ':slug': slug },
  ProjectionExpression: projectionExpression,
});

export const buildBlogByRelativePublishedAtQuery = (
  primaryPost: BlogPost,
  position: 'before' | 'after',
  limit: number = 1
): QueryCommandInput => {
  const operator = position === 'before' ? '<' : '>';

  return {
    TableName: TABLE_NAME,
    KeyConditionExpression: `PK = :pk AND SK ${operator} :sk`,
    ExpressionAttributeValues: {
      ':pk': 'BLOG',
      ':sk': `${primaryPost.publishedAt}#${primaryPost.id}`,
    },
    ScanIndexForward: !(position === 'before'),
    ProjectionExpression: projectionExpression,
    Limit: limit,
  };
};
