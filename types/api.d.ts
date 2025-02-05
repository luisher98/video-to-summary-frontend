export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ErrorResponseOptions {
  status?: number;
  message?: string;
}

export interface ErrorResponseBody {
  success: false;
  error: string;
} 