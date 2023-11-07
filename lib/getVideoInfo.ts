export default async function getVideoInfo(url = "") {
    const API_URL = "http://localhost:3500/videoInfo";
    try {
 
      const response = await fetch(API_URL);
  
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