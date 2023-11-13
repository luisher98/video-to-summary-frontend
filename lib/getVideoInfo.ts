export default async function getInfo(url: string) {
  try {
    const response = await fetch(`/api/video-info?url=${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw new Error("Network response error", response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
