export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: VideoThumbnail;
  channel: string;
  description: string;
}

export interface VideoStatus {
  id: string;
  status: 'available' | 'unavailable' | 'private' | 'processing';
  message?: string;
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeSnippet {
  title: string;
  description: string;
  thumbnails: {
    medium: YouTubeThumbnail;
  };
  channelTitle: string;
}

export interface YouTubeVideo {
  snippet: YouTubeSnippet;
}

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
} 