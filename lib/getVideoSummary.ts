export default async function getSummary(url: string, words: number) {
  try {
    const response = await fetch(`/api/video-summary?url=${url}?words=${words}`, {
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
