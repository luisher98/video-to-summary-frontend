import { getApiUrl } from './env';
import type { SummaryProcessingUpdate } from '@/types';

function isSummaryUpdate(value: unknown): value is SummaryProcessingUpdate {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'message' in value &&
    typeof (value as { status: unknown }).status === 'string' &&
    typeof (value as { message: unknown }).message === 'string' &&
    ['processing', 'pending', 'done', 'error'].includes((value as { status: string }).status)
  );
}

export default async function* getSummary(
  url: string,
  words: number
): AsyncGenerator<SummaryProcessingUpdate> {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(
      `${API_URL}/api/youtube-summary-sse?url=${url}&words=${words}`,
      {
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null or undefined');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last line in the buffer if it's not complete
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          
          try {
            const jsonStr = line.slice(6); // Remove 'data: ' prefix
            const parsed = JSON.parse(jsonStr) as unknown;
            if (isSummaryUpdate(parsed)) {
              yield parsed;
            }
          } catch {
            // Ignore parsing errors
          }
        }
      }
    }

    // Process any remaining data in the buffer
    if (buffer.trim() && buffer.startsWith('data: ')) {
      try {
        const jsonStr = buffer.slice(6);
        const parsed = JSON.parse(jsonStr) as unknown;
        if (isSummaryUpdate(parsed)) {
          yield parsed;
        }
      } catch {
        // Ignore parsing errors
      }
    }
  } catch (error) {
    throw error;
  }
}
