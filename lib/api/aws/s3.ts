import { S3Client } from '@aws-sdk/client-s3';
import { sdkClientConfig } from './shared';
import { S3Error } from '@/errors/api-errors';
import { createErrorResponse } from '../common/response-helper';
import { StatusCodes } from 'http-status-codes';
import { sanitizedClientStatusCodes } from '@/lib/error-handling/api';

export const getS3Client = () => new S3Client(sdkClientConfig);

export const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

interface S3ResponseCheckOptions {
  expectedStatus?: number;
  errorMessage?: string;
  customerFacing?: boolean;
}

export const s3ResponseErrorCheck = <
  T extends { $metadata?: { httpStatusCode?: number } },
>(
  response: T,
  options: S3ResponseCheckOptions = {}
) => {
  const {
    expectedStatus = StatusCodes.OK,
    errorMessage,
    customerFacing,
  } = options;

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

    s3Error.log();

    const statusCode = !customerFacing
      ? sanitizedClientStatusCodes(actualStatus)
      : actualStatus;

    return createErrorResponse(s3Error.userMessage, s3Error.code, statusCode);
  }
  return null;
};
