import { StatusCodes } from 'http-status-codes';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly userMessage: string;
  readonly severity: ErrorSeverity;
  readonly context?: Record<string, unknown>;
  readonly statusCode: StatusCodes;
}

export abstract class AbstractApiError extends Error implements AppError {
  abstract readonly code: string;
  abstract readonly userMessage: string;
  abstract readonly severity: ErrorSeverity;
  abstract readonly statusCode: StatusCodes;
  readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
  }
}
