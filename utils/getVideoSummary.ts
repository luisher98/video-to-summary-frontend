export default async function getSummary(url: string) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/summary?url=${url}`,
    );
    if(!response.ok) throw new Error('Network response error', response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
