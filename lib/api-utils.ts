import { NextResponse } from 'next/server';
import type { ErrorResponseOptions, ErrorResponseBody } from '@/types/api';

export function createErrorResponse({ message = 'An error occurred', status = 400 }: ErrorResponseOptions): NextResponse<ErrorResponseBody> {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
} 