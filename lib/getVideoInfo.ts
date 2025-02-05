import { getApiUrl } from './env';
import type { VideoInfo } from '@/types';

export default async function getInfo(url: string): Promise<VideoInfo | null> {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/info?url=${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }
    
    const data = await response.json() as Partial<VideoInfo>;

    if (!data?.id || !data.title || !data.thumbnail || !data.channel || !data.description) {
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
    return null;
  }
}
