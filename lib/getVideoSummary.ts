export default async function* getSummary(
  url: string,
  words: number
) {
  const response = await fetch(`/api/video-summary-sse?url=${url}&words=${words}`);

  if (!response.ok) throw `ERROR - status: ${response.statusText}`;
  if (!response.body) throw `ERROR - response body is null or undefined!`;

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    try {
      yield decoder.decode(value);
    } catch (e: any) {
      console.warn(e.message);
    }
  }
}
