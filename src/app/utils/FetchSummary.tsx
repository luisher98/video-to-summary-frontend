export default async function getSummary(url) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/summary?url=${url}`,
    );

    if (!response.ok) {
      throw new Error("Network response failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
    return null; // You can return null or an error message
  }
}
