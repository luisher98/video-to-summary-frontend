export default async function FetchSummary(url: string) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/summary?url=${url}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
