import {
  createErrorResponse,
  ErrorResponse,
} from '@/lib/api/common/response-structures';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

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

  log(): void {
    console.group(`Api Error: [${this.severity.toUpperCase()}] ${this.name}`);
    console.error('Message:', this.message);
    console.error('User Message:', this.userMessage);
    console.error('Code:', this.code);
    console.error('Status Code:', this.statusCode);

    if (this.context && Object.keys(this.context).length > 0) {
      console.error('Context:', this.context);
    }

    if (this.stack) {
      console.error('Stack Trace:', this.stack);
    }
    console.groupEnd();
  }

  createApiErrorResponse(
    message: string,
    code = this.code,
    statusCode: StatusCodes = this.statusCode,
    details?: Record<string, unknown>
  ): NextResponse<ErrorResponse> {
    return createErrorResponse(message, code, statusCode, details);
  }
}
