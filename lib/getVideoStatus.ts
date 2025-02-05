import { getApiUrl } from './env';
import type { VideoInfo } from '@/types';

export default async function getVideoStatus(url: string): Promise<boolean> {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/info?url=${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json() as VideoInfo;
    return Boolean(data?.id);
  } catch (error) {
    return false;
  }
}
