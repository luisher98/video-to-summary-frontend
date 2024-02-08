export default async function getSummarySSE(url: string, words: number) {
    try {
      const response = await fetch(`/api/video-summary-sse?url=${url}?words=${words}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`Network response error, ${response.status}`);
      const data = await response.json() as Summary;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  