import { getApiUrl } from './env';
import type { VideoInfo } from '@/types';

interface ApiResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    channel: string;
    description: string;
  };
}

export default async function getInfo(url: string): Promise<VideoInfo | null> {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/info?url=${encodeURIComponent(url)}`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }
    
    const { success, data } = await response.json() as ApiResponse;
    if (!success || !data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      channel: data.channel,
      description: data.description
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    return null;
  }
}
