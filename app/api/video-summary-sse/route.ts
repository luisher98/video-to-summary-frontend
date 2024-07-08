import { streamingJsonResponse } from "@/app/server/streaming";

export const dynamic = "force-dynamic";

async function *fetchSummaryUpdates(url, words): AsyncGenerator<Item, void, unknown> {
  const API_URL = process.env.API_URL ?? "http://localhost:5050";
  const response = await fetch(`${API_URL}/api/summary-sse?url=${url}&words=${words}`)
  const reader = response.body?.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield (new TextDecoder().decode(value));
  }
}


export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const words = searchParams.get("words");
  return streamingJsonResponse(fetchSummaryUpdates(url, words));
}
