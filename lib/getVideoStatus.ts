export default async function getVideoStatus(url: string) {
  try {
    const response = await fetch(`/api/video-status?url=${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw new Error(`Network response error, ${response.status}`);
    const data = (await response.json()) as { status: number };

    if (data.status === 404) {
      return false;
    }

    if (data.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
}
