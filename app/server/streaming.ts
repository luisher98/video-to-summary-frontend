class StreamingResponse extends Response {
  constructor(res: ReadableStream<Uint8Array>, init?: ResponseInit) {
    super(res, {
      ...init,
      status: 200,
      headers: {
        ...init?.headers,
      },
    });
  }
}

const stringToUint8Array = (str: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

export const streamingJsonResponse = <T extends string/*Record<string, unknown>*/>(
  generator: AsyncGenerator<T, void, unknown>,
): Response => {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of generator) {
        const chunkData = stringToUint8Array(JSON.stringify(chunk));
        controller.enqueue(chunkData);
      }
      controller.close();
    },
  });

  return new StreamingResponse(stream, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
