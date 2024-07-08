class StreamingResponse extends Response {
  constructor(res: ReadableStream<any>, init?: ResponseInit) {
    super(res as any, {
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

export const streamingJsonResponse = <T extends Record<string, unknown>>(
  generator: AsyncGenerator<T, void, unknown>,
): Response => {
  const stream = new ReadableStream<any>({
    async start(controller) {
      for await (let chunk of generator) {
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
