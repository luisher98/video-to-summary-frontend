import { createErrorResponse } from "@/lib/api-utils";
import { wordCountSchema } from "@/lib/validations/youtube";
import { getApiUrl } from "@/lib/env";
import { delay } from "@/app/utils/utils";

interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
}

interface ProgressUpdate {
  status: 'uploading' | 'processing' | 'done' | 'error';
  message: string;
  progress?: number;
}

/**
 * Configuration for the API route
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

/**
 * Helper function that streams summary updates from the backend API for uploaded files
 */
async function* fetchUploadSummaryUpdates(
  formData: FormData,
  words: number,
): AsyncGenerator<string, void, unknown> {
  const API_URL = getApiUrl();
  
  try {
    console.log('Sending file to backend:', `${API_URL}/api/upload-summary-sse?words=${words}`);
    
    const response = await fetch(
      `${API_URL}/api/upload-summary-sse?words=${words}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'text/event-stream',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      const errorMessage = errorData.message ?? errorData.error ?? `API request failed: ${response.statusText}`;
      console.error('API error response:', errorData);
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get reader from response body");
    }

    console.log('Starting to read SSE stream');
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('SSE stream completed');
        break;
      }
      
      if (value) {
        const decodedValue = new TextDecoder().decode(value);
        console.log('Received raw SSE chunk:', decodedValue);
        const lines = decodedValue.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = line.slice(5);
              console.log('Processing SSE event:', eventData);
              yield line + '\n';
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
              continue;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in fetchUploadSummaryUpdates:', error);
    throw error;
  }
}

/**
 * POST /api/upload-summary-sse
 * 
 * Streams a video summary from an uploaded file using Server-Sent Events (SSE).
 * Handles multipart/form-data uploads and streams the summary back to the client.
 * 
 * @param request - The incoming request object containing:
 *   - video: Video file (multipart/form-data)
 *   - words: Target word count for the summary
 * 
 * @returns 
 * - 200: SSE stream with summary updates
 * - 400: Bad request (missing file, invalid words parameter)
 * - 413: File too large
 * - 415: Unsupported file type
 * 
 * @example
 * // Request
 * POST /api/upload-summary-sse?words=200
 * Content-Type: multipart/form-data
 * 
 * // Response Stream
 * data: {"status": "uploading", "progress": 30}
 * data: {"status": "processing", "progress": 60}
 * data: {"status": "complete", "summary": "..."}
 */
export async function POST(request: Request) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return createErrorResponse({
        message: 'Content-Type must be multipart/form-data',
        status: 415
      });
    }

    // Get and validate word count
    const url = new URL(request.url);
    const words = Number(url.searchParams.get('words'));
    const wordResult = wordCountSchema.safeParse(words);
    if (!wordResult.success) {
      return createErrorResponse({
        message: wordResult.error?.errors[0]?.message ?? 'Invalid word count',
        status: 400
      });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return createErrorResponse({
        message: 'No video file provided',
        status: 400
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return createErrorResponse({
        message: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
        status: 413
      });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return createErrorResponse({
        message: 'Unsupported file type. Supported types: MP4, WebM, QuickTime',
        status: 415
      });
    }

    // Set up SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = fetchUploadSummaryUpdates(formData, wordResult.data);
          
          for await (const chunk of generator) {
            controller.enqueue(encoder.encode(chunk + '\n'));
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      },
    });
  } catch (error) {
    console.error('Error in /api/upload-summary-sse:', error);
    return createErrorResponse({
      message: error instanceof Error ? error.message : 'Internal server error',
      status: 500
    });
  }
} 