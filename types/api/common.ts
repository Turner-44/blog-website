export interface ErrorResponse {
  message: string;
  success: false;
}

export type Result<T> = { success: true; data: T } | ErrorResponse;
