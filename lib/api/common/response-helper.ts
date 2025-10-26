import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

export interface BaseResponse {
  readonly success: boolean;
  readonly message: string;
  readonly timestamp: string;
}

export interface SuccessResponse<TData = unknown> extends BaseResponse {
  readonly success: true;
  readonly data: TData;
}

export interface ErrorResponse extends BaseResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly details?: Record<string, unknown>;
  };
}

export const createSuccessResponse = <TData>(
  data: TData,
  message = 'Request completed successfully',
  statusCode: StatusCodes = StatusCodes.OK,
  headers?: Record<string, string> | Headers
): NextResponse<SuccessResponse<TData>> => {
  const response: SuccessResponse<TData> = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    data,
  };

  return NextResponse.json(response, {
    status: statusCode,
    ...(headers && { headers }),
  });
};

export const createErrorResponse = (
  message: string,
  code = 'UNKNOWN_ERROR',
  statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  details?: Record<string, unknown>
): NextResponse<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    error: {
      code,
      ...(details && { details }),
    },
  };

  return NextResponse.json(response, { status: statusCode });
};
