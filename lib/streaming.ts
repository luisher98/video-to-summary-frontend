/**
 * Creates a streaming response that yields JSON data
 */
export function streamingJsonResponse(
  generator: () => AsyncGenerator<string, void, unknown>,
  init?: ResponseInit
): Response {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator()) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...init?.headers,
    },
    ...init,
  });
} 