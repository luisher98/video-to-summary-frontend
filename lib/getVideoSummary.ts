export default async function getVideoSummary(url) {
  try {
    // API call to the backend (using json-server instead for now)
    // const response = await fetch(
    //   `http://localhost:5000/api/summary?url=${url}`,
    // );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
