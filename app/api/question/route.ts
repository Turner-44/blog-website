import {
  dynamoDBClient,
  dynamoDBResponseErrorCheck,
  QUESTION_PK,
  QUESTIONS_TABLE_NAME,
} from '@/lib/api/aws/dynamo';
import { createSuccessResponse } from '@/lib/api/common/response-helper';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import {
  genericCatchError,
  validateRequestAgainstSchema,
} from '@/lib/error-handling/api';
import { storeQuestionSchema } from '@/lib/zod/questions-schema';
import { Question } from '@/types/api/question';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const questionId = url.searchParams.get('id');
    const projectionExpression = 'PK, SK, id, createdAt, question';

    let getQuestionsQuery;
    if (questionId) {
      getQuestionsQuery = {
        TableName: QUESTIONS_TABLE_NAME,
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'PK',
          '#sk': 'SK',
        },
        ExpressionAttributeValues: {
          ':pk': QUESTION_PK,
          ':sk': `${questionId}`, // SK format is createdAt#id, so we search for the id part
        },
        ProjectionExpression: projectionExpression,
      };
    } else {
      getQuestionsQuery = {
        TableName: QUESTIONS_TABLE_NAME,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': 'PK' },
        ExpressionAttributeValues: { ':pk': QUESTION_PK },
        ProjectionExpression: projectionExpression,
        Limit: Number(url.searchParams.get('limit') ?? 1),
        ScanIndexForward: false, // Latest first (descending order)
      };
    }

    const dynamodbRes = await dynamoDBClient.send(
      new QueryCommand(getQuestionsQuery)
    );

    const awsError = dynamoDBResponseErrorCheck(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to retrieve question ${questionId ? questionId : ''}`,
    });
    if (awsError) return awsError;

    return createSuccessResponse(
      {
        questions: (dynamodbRes.Items ?? []) as Question[],
      },
      'Retrieved',
      StatusCodes.OK
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}

export async function POST(req: Request) {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const reqData = await req.json();

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const question: Question = {
      PK: 'QUESTION',
      SK: `${createdAt}#${id}`,
      id: id,
      createdAt: createdAt,
      ...reqData,
    };

    const schemaError = validateRequestAgainstSchema(
      question,
      storeQuestionSchema
    );
    if (schemaError) return schemaError;

    const dynamodbRes = await dynamoDBClient.send(
      new PutCommand({
        TableName: QUESTIONS_TABLE_NAME,
        Item: question,
      })
    );

    const awsError = dynamoDBResponseErrorCheck(dynamodbRes, {
      expectedStatus: StatusCodes.OK,
      errorMessage: `Failed to create question - ${reqData.question}`,
    });
    if (awsError) return awsError;

    return createSuccessResponse(question, 'Created', StatusCodes.CREATED);
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
