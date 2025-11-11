import { BlogPost } from '@/types/blog';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { sdkClientConfig } from './shared';
import { StatusCodes } from 'http-status-codes';
import { DynamoDbError } from '@/errors/api-errors';
import { createErrorResponse } from '../common/response-helper';
import { sanitizedClientStatusCodes } from '@/lib/error-handling/api';

const getDbClient = () => new DynamoDBClient(sdkClientConfig);

export const dynamoDBClient = DynamoDBDocumentClient.from(getDbClient());

export const BLOG_POSTS_TABLE_NAME = process.env.BLOG_POSTS_TABLE_NAME;
export const QUESTIONS_TABLE_NAME = process.env.QUESTIONS_TABLE_NAME;

export const BLOG_PK = 'BLOG';
export const QUESTION_PK = 'QUESTION';

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
  TableName: BLOG_POSTS_TABLE_NAME,
  KeyConditionExpression: '#pk = :pk',
  ExpressionAttributeNames: { '#pk': 'PK' },
  ExpressionAttributeValues: { ':pk': BLOG_PK },
  ProjectionExpression: projectionExpression,
  Limit: Number(url.searchParams.get('limit') ?? 50),
  ExclusiveStartKey: startKey,
  ScanIndexForward: false,
});

export const buildBlogBySlugQuery = (slug: string): QueryCommandInput => ({
  TableName: BLOG_POSTS_TABLE_NAME,
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
    TableName: BLOG_POSTS_TABLE_NAME,
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

interface DynamoResponseCheckOptions {
  expectedStatus?: number;
  errorMessage?: string;
  customerFacing?: boolean;
}

export const dynamoDBResponseErrorCheck = <
  T extends { $metadata?: { httpStatusCode?: number } },
>(
  response: T,
  options: DynamoResponseCheckOptions = {}
) => {
  const {
    expectedStatus = StatusCodes.OK,
    errorMessage,
    customerFacing,
  } = options;

  const actualStatus = response?.$metadata?.httpStatusCode;

  if (actualStatus !== expectedStatus) {
    const dynamoDbError = new DynamoDbError(
      errorMessage ?? `DynamoDB request failed with status ${actualStatus}`,
      {
        expectedStatus,
        actualStatus,
        awsResponse: response,
      }
    );

    dynamoDbError.log();

    const statusCode = !customerFacing
      ? sanitizedClientStatusCodes(actualStatus)
      : actualStatus;

    return createErrorResponse(
      dynamoDbError.userMessage,
      dynamoDbError.code,
      statusCode
    );
  }
  return null;
};
