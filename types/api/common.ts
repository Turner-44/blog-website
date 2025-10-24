import {
  ErrorResponse,
  SuccessResponse,
} from '@/lib/api/common/response-structures';
import { NextResponse } from 'next/server';

export type ApiResponse<TData = unknown> =
  | SuccessResponse<TData>
  | ErrorResponse;

export type NextApiResponse<TData = unknown> = NextResponse<ApiResponse<TData>>;
