export default async function FetchInfo(url: string) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/info?url=${url}`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }