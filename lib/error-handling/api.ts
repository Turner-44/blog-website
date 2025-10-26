import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from '@/errors/api-errors';
import { createErrorResponse } from '@/lib/api/common/response-structures';

export const sanitizedClientStatusCodes = (
  actualStatus: number | undefined
) => {
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
    validationError.log();

    return createErrorResponse(
      validationError.userMessage,
      validationError.code,
      StatusCodes.BAD_REQUEST,
      { validationErrors: result.error.message }
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

    validationError.log();

    return validationError.createApiErrorResponse();
  }
  return null;
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
