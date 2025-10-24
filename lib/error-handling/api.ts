import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { DynamoDbError, S3Error, ValidationError } from '@/errors/api-errors';
import { createErrorResponse } from '@/lib/api/common/response-structures';

const sanitizedClientStatusCodes = (actualStatus: number | undefined) => {
  return typeof actualStatus === 'number' &&
    actualStatus >= StatusCodes.BAD_REQUEST &&
    actualStatus < 600
    ? actualStatus
    : StatusCodes.INTERNAL_SERVER_ERROR;
};

export const validateRequestAgainstSchema = (
  data: unknown,
  schema: z.ZodSchema
) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const validationError = new ValidationError(result.error.message, {
      name: result.error.name,
      expected: schema,
      received: data,
    });
    console.error('API Error: ', validationError);

    return createErrorResponse(
      validationError.userMessage,
      validationError.code,
      StatusCodes.BAD_REQUEST,
      { validationErrors: result.error.message }
    );
  }
  return null;
};

interface DynamoResponseCheckOptions {
  expectedStatus?: number;
  errorMessage?: string;
}

export const dynamoDBResponseHandler = <
  T extends { $metadata?: { httpStatusCode?: number } },
>(
  response: T,
  options: DynamoResponseCheckOptions = {}
) => {
  const { expectedStatus = StatusCodes.OK, errorMessage } = options;

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

    console.error('DynamoDB Error:', dynamoDbError);

    return createErrorResponse(
      dynamoDbError.userMessage,
      dynamoDbError.code,
      sanitizedClientStatusCodes(actualStatus)
    );
  }
  return null;
};

interface S3ResponseCheckOptions {
  expectedStatus?: number;
  errorMessage?: string;
}

export const s3ResponseHandler = <
  T extends { $metadata?: { httpStatusCode?: number } },
>(
  response: T,
  options: S3ResponseCheckOptions = {}
) => {
  const { expectedStatus = StatusCodes.OK, errorMessage } = options;

  const actualStatus = response?.$metadata?.httpStatusCode;

  if (actualStatus !== expectedStatus) {
    const s3Error = new S3Error(
      errorMessage ?? `S3 request failed with status ${actualStatus}`,
      {
        expectedStatus,
        actualStatus,
        awsResponse: response,
      }
    );

    console.error('S3 Error:', s3Error);

    return createErrorResponse(
      s3Error.userMessage,
      s3Error.code,
      sanitizedClientStatusCodes(actualStatus)
    );
  }
  return null;
};

export const validateResponseStatus = (
  actualStatus: StatusCodes | undefined,
  expectedStatus: StatusCodes,
  errorMessage: string
) => {
  if (actualStatus !== expectedStatus) {
    const validationError = new ValidationError(errorMessage, {
      expectedStatus,
      actualStatus,
    });

    console.error('API Error: ', validationError);

    return createErrorResponse(
      validationError.userMessage,
      validationError.code,
      actualStatus
    );
  }
  return null;
};

export const validateResultsFound = (
  expectedResult: unknown,
  actualResult: unknown = true
) => {
  if (expectedResult !== actualResult) {
    const error = new ValidationError(
      `Expected ${expectedResult} to equal ` + actualResult
    );
    console.error('API Error: ', error);

    return createErrorResponse(
      error.userMessage,
      error.code,
      StatusCodes.NOT_FOUND
    );
  }
};

export const genericCatchError = (err: Error | unknown) => {
  console.error('API Error: ', err);
  const message = err instanceof Error ? err.message : 'Unknown API error';

  return createErrorResponse(
    message,
    'UNKNOWN_ERROR',
    StatusCodes.INTERNAL_SERVER_ERROR
  );
};
