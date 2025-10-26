import { AbstractApiError } from './abstract-api-error';
import { StatusCodes } from 'http-status-codes';

export class ValidationError extends AbstractApiError {
  readonly code = 'VALIDATION_ERROR';
  readonly userMessage = 'Please check your input and try again.';
  readonly severity = 'low' as const;
  readonly statusCode = StatusCodes.BAD_REQUEST;
}

export class BlogCreationError extends AbstractApiError {
  readonly code = 'BLOG_CREATION_ERROR';
  readonly userMessage = 'Unable to create blog post. Please try again.';
  readonly severity = 'medium' as const;
  readonly statusCode = StatusCodes.BAD_REQUEST;
}

export class DynamoDbError extends AbstractApiError {
  readonly code = 'DYNAMODB_ERROR';
  readonly userMessage =
    'A technical issue occurred. Our team has been notified.';
  readonly severity = 'high' as const;
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}

export class S3Error extends AbstractApiError {
  readonly code = 'S3_ERROR';
  readonly userMessage = 'File operation failed. Please try again.';
  readonly severity = 'medium' as const;
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}

export class UnauthorizedError extends AbstractApiError {
  readonly code = 'UNAUTHORIZED_ERROR';
  readonly userMessage = 'You are not authorized to perform this action.';
  readonly severity = 'medium' as const;
  readonly statusCode = StatusCodes.UNAUTHORIZED;
}

export class NotFoundError extends AbstractApiError {
  readonly code = 'NOT_FOUND_ERROR';
  readonly userMessage = 'The requested resource was not found.';
  readonly severity = 'medium' as const;
  readonly statusCode = StatusCodes.NOT_FOUND;
}

export class UnknownError extends AbstractApiError {
  readonly code = 'UNKNOWN_ERROR';
  readonly userMessage = 'An unknown error occurred. Please try again later.';
  readonly severity = 'high' as const;
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}

export class FailedToDeleteError extends AbstractApiError {
  readonly code = 'FAILED_TO_DELETE_ERROR';
  readonly userMessage = 'Failed to delete the requested resource.';
  readonly severity = 'medium' as const;
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}

export class FailedToCreateError extends AbstractApiError {
  readonly code = 'FAILED_TO_CREATE_ERROR';
  readonly userMessage = 'Failed to create the requested resource.';
  readonly severity = 'medium' as const;
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}
