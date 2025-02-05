import type { NextRequest } from 'next/server';
import getVideoSummary from '@/lib/getVideoSummary';
import { createErrorResponse } from '@/lib/api-utils';
import { youtubeUrlSchema, wordCountSchema } from '@/lib/validations/youtube';

/**
 * Configuration for the API route
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

/**
 * GET /api/youtube-summary-sse
 * 
 * Generates and streams a summary of a YouTube video using Server-Sent Events (SSE).
 * The summary is generated in chunks and streamed back to the client in real-time.
 * 
 * @param request - The incoming request object containing:
 *   - url: YouTube video URL
 *   - wordCount: Desired length of the summary in words
 * 
 * @returns 
 * - 200: SSE stream with summary updates
 * - 400: Bad request (missing parameters, invalid URL, invalid word count)
 * - 500: Internal server error
 * 
 * @example
 * // Request
 * GET /api/youtube-summary-sse?url=https://www.youtube.com/watch?v=VIDEO_ID&wordCount=200
 * 
 * // SSE Response Events
 * data: {
 *   "type": "start",
 *   "message": "Starting summary generation..."
 * }
 * 
 * data: {
 *   "type": "progress",
 *   "message": "Analyzing video content..."
 * }
 * 
 * data: {
 *   "type": "summary",
 *   "message": "First part of the summary..."
 * }
 * 
 * data: {
 *   "type": "complete",
 *   "message": "Summary generation complete"
 * }
 * 
 * @throws {Error} If the client doesn't support SSE
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const wordCount = request.nextUrl.searchParams.get('wordCount');

    if (!url) {
      return createErrorResponse({
        message: 'URL parameter is required',
        status: 400
      });
    }

    if (!wordCount) {
      return createErrorResponse({
        message: 'Word count parameter is required',
        status: 400
      });
    }

    const urlResult = youtubeUrlSchema.safeParse(url);
    if (!urlResult.success) {
      return createErrorResponse({
        message: urlResult.error?.errors[0]?.message ?? 'Invalid YouTube URL',
        status: 400
      });
    }

    const wordResult = wordCountSchema.safeParse(parseInt(wordCount, 10));
    if (!wordResult.success) {
      return createErrorResponse({
        message: wordResult.error?.errors[0]?.message ?? 'Invalid word count',
        status: 400
      });
    }

    const accept = request.headers.get('accept');
    if (accept !== 'text/event-stream') {
      return new Response('SSE not supported', { status: 400 });
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'text/event-stream');
    responseHeaders.set('Connection', 'keep-alive');
    responseHeaders.set('Cache-Control', 'no-cache, no-transform');

    const stream = getVideoSummary(urlResult.data, wordResult.data);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const update of stream) {
            const message = `data: ${JSON.stringify(update)}\n\n`;
            controller.enqueue(encoder.encode(message));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error in /api/youtube-summary-sse:', error);
    return createErrorResponse({
      message: 'Internal server error',
      status: 500
    });
  }
} 