import {
  ErrorResponse,
  SuccessResponse,
} from '@/lib/api/common/response-helper';
import { NextResponse } from 'next/server';

export type ApiResponse<TData = unknown> =
  | SuccessResponse<TData>
  | ErrorResponse;

export type NextApiResponse<TData = unknown> = NextResponse<ApiResponse<TData>>;
