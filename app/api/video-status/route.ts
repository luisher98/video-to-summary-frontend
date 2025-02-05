import { NextResponse } from "next/server";
import type { YouTubeApiResponse } from "@/types/video";

/**
 * Configuration for the API route
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/video-status
 * 
 * Checks if a YouTube video exists and is accessible.
 * Makes a request to the YouTube API to verify video availability.
 * 
 * @param req - The incoming request object containing the YouTube URL in query parameters
 * @returns 
 * - 200: Video exists and is accessible
 * - 404: Video not found or not accessible
 * - 500: Internal server error (API issues, missing env vars)
 * 
 * @example
 * // Request
 * GET /api/video-status?url=https://www.youtube.com/watch?v=VIDEO_ID
 * 
 * // Success Response
 * {
 *   "status": 200
 * }
 * 
 * // Error Response
 * {
 *   "status": 404
 * }
 */
export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const GOOGLE_API_URL = process.env.GOOGLE_API_URL;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    if (!GOOGLE_API_URL || !GOOGLE_API_KEY) {
      throw new Error("Missing environment variables");
    }

    const url = searchParams.get("url");

    if (!url) {
      throw new Error("URL parameter is missing");
    }

    const id = url.split("?v=")[1];

    if (!id) {
      throw new Error("Invalid URL format");
    }

    const response = await fetch(
      `${GOOGLE_API_URL}?id=${id}&key=${GOOGLE_API_KEY}&part=snippet`,
    );
    
    const data = (await response.json()) as YouTubeApiResponse;

    if (!response.ok) {
      throw new Error("Failed to fetch data from YouTube API");
    }

    if (data.items.length > 0) {
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json({ status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: (error as Error).message });
  }
}
