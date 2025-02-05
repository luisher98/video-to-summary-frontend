import type { NextRequest } from 'next/server';
import getVideoInfo from '@/lib/getVideoInfo';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { youtubeUrlSchema } from '@/lib/validations/youtube';

/**
 * Configuration for the API route
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/info
 * 
 * Retrieves metadata information about a YouTube video.
 * 
 * @param request - The incoming request object containing the YouTube URL in query parameters
 * @returns 
 * - 200: Success response with video information
 * - 400: Bad request (missing URL, invalid URL format)
 * - 404: Video not found
 * - 500: Internal server error
 * 
 * @example
 * // Request
 * GET /api/info?url=https://www.youtube.com/watch?v=VIDEO_ID
 * 
 * // Success Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "VIDEO_ID",
 *     "title": "Video Title",
 *     "thumbnail": {
 *       "url": "https://...",
 *       "width": 1280,
 *       "height": 720
 *     },
 *     "channel": "Channel Name",
 *     "description": "Video description..."
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return createErrorResponse({
        message: 'URL parameter is required',
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

    const videoInfo = await getVideoInfo(urlResult.data);
    if (!videoInfo) {
      return createErrorResponse({
        message: 'Failed to fetch video info',
        status: 404
      });
    }

    return createSuccessResponse(videoInfo);
  } catch (error) {
    console.error('Error in /api/info:', error);
    return createErrorResponse({
      message: 'Internal server error',
      status: 500
    });
  }
} 