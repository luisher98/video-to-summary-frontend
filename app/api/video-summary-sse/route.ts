import { streamingJsonResponse } from "@/app/server/streaming";
import { delay } from "@/app/utils/utils";

/**
 * Configuration for the API route
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const dynamic = "force-dynamic";

/**
 * Helper function that fetches and streams summary updates from the backend API
 * 
 * @param url - The YouTube video URL to summarize
 * @param words - The target number of words for the summary
 * @param throttleMs - Delay between updates in milliseconds to control streaming rate
 * @yields String chunks of the summary as they become available
 * @throws {Error} If the reader cannot be obtained from response body
 */
async function* fetchSummaryUpdates(
  url: string,
  words: number,
  throttleMs: number,
): AsyncGenerator<string, void, unknown> {
  const API_URL = process.env.API_URL ?? "http://localhost:5050";
  const response = await fetch(
    `${API_URL}/api/summary-sse?url=${url}&words=${words}`,
  );
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      const decodedValue = new TextDecoder().decode(value /*{, stream: true }*/);
      yield decodedValue;
      await delay(throttleMs); // Throttle the updates
    }
  }
}

/**
 * GET /api/video-summary-sse
 * 
 * Streams a video summary from the backend API using Server-Sent Events (SSE).
 * The summary is throttled to ensure smooth delivery to the client.
 * 
 * @param request - The incoming request object containing:
 *   - url: YouTube video URL
 *   - words: Target word count for the summary
 * 
 * @returns 
 * - 200: SSE stream with throttled summary updates
 * - 400: Bad request (missing URL or words parameter)
 * 
 * @example
 * // Request
 * GET /api/video-summary-sse?url=https://www.youtube.com/watch?v=VIDEO_ID&words=200
 * 
 * // Response Stream
 * data: "First chunk of summary..."
 * data: "Second chunk of summary..."
 * data: "Final chunk of summary..."
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const words = Number(searchParams.get("words"));

  if (!url) {
    return new Response(JSON.stringify({ status: "error", message: "Missing URL parameter" }), {
      status: 400,
    });
  }

  if (!words) {
    return new Response(JSON.stringify({ status: "error", message: "Missing words parameter" }), {
      status: 400,
    });
  }

  return streamingJsonResponse(fetchSummaryUpdates(url, words, 500));
}
