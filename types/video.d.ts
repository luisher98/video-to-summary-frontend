export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channel: string;
  duration: number;
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

export interface YouTubeContentDetails {
  duration: string;  // ISO 8601 duration format (e.g., PT1H2M10S)
}

export interface YouTubeVideo {
  snippet: YouTubeSnippet;
  contentDetails: YouTubeContentDetails;
}

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
} 