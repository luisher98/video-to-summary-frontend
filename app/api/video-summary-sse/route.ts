import { streamingJsonResponse } from "@/app/server/streaming";
import { delay } from "@/app/utils/utils";

export const dynamic = "force-dynamic";

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
