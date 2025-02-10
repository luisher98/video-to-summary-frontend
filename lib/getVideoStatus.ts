import { getApiUrl } from './env';

interface ApiResponse {
  success: boolean;
  data?: {
    id: string;
  };
}

export default async function getVideoStatus(url: string): Promise<boolean> {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/info?url=${encodeURIComponent(url)}`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    const { success, data } = await response.json() as ApiResponse;
    return success && Boolean(data?.id);
  } catch (error) {
    console.error('Error checking video status:', error);
    return false;
  }
}
