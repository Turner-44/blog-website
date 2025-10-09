import { ErrorResponse } from '@/types/api/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';

const sanitizedClientStatusCodes = (actualStatus: number | undefined) => {
  return typeof actualStatus === 'number' &&
    actualStatus >= StatusCodes.BAD_REQUEST &&
    actualStatus < 600
    ? actualStatus
    : StatusCodes.INTERNAL_SERVER_ERROR;
};

export const createErrorResponse = (message: string): ErrorResponse => ({
  message,
  success: false,
});

export const validateRequestAgainstSchema = (
  data: unknown,
  schema: z.ZodSchema
) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('API Error: ', {
      name: result.error.name,
      message: result.error.message,
      data,
    });
    return NextResponse.json<ErrorResponse>(
      createErrorResponse(result.error.message),
      { status: StatusCodes.BAD_REQUEST }
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
    const fallbackMessage = `DynamoDB request failed with status ${actualStatus}`;
    const message = errorMessage ?? fallbackMessage;

    console.error('DynamoDB Error:', {
      expectedStatus,
      actualStatus,
      awsResponse: response,
    });

    return NextResponse.json<ErrorResponse>(createErrorResponse(message), {
      status: sanitizedClientStatusCodes(actualStatus),
    });
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
    const fallbackMessage = `S3 request failed with status ${actualStatus}`;
    const message = errorMessage ?? fallbackMessage;

    console.error('S3 Error:', {
      expectedStatus,
      actualStatus,
      awsResponse: response,
    });

    return NextResponse.json<ErrorResponse>(createErrorResponse(message), {
      status: sanitizedClientStatusCodes(actualStatus),
    });
  }
  return null;
};

export const validateResponse = (
  actualStatus: StatusCodes | undefined,
  expectedStatus: StatusCodes,
  errorMessage: string
) => {
  if (actualStatus !== expectedStatus) {
    console.error('API Error: ', {
      expectedStatus,
      actualStatus,
    });
    return NextResponse.json<ErrorResponse>(createErrorResponse(errorMessage), {
      status: actualStatus,
    });
  }
  return null;
};

export const validateResultFound = (
  result: unknown,
  ErrorResponse: ErrorResponse = createErrorResponse('No result found')
) => {
  if (!result) {
    console.error('API Error: ', ErrorResponse);
    return NextResponse.json<ErrorResponse>(ErrorResponse, { status: 404 });
  }
};

export const genericCatchError = (err: Error | unknown) => {
  console.error('API Error: ', err);
  const message = err instanceof Error ? err.message : 'Unknown API error';

  return NextResponse.json<ErrorResponse>(createErrorResponse(message), {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  });
};
