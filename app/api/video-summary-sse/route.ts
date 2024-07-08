import { streamingJsonResponse } from "@/app/server/streaming";

export const dynamic = "force-dynamic";

async function *fetchItems(url, words): AsyncGenerator<Item, void, unknown> {
  const response = await fetch(`http://localhost:5050/api/summary-sse?url=${url}&words=${words}`)
  const reader = response.body?.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield (new TextDecoder().decode(value));
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const words = searchParams.get("words");
  return streamingJsonResponse(fetchItems(url, words));
}
