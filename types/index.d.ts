export * from './video';
export * from './summary';
export * from './context';
export * from './api';

declare module 'youtube-summary' {
  interface VideoThumbnail {
    url: string;
    width: number;
    height: number;
  }

  interface VideoInfo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    channel: string;
    duration: number;
  }

  type SummaryStatus = 'processing' | 'pending' | 'done' | 'error';

  interface SummaryProcessingUpdate {
    status: SummaryStatus;
    message: string;
  }

  interface SummaryResponse extends SummaryProcessingUpdate {
    error?: string;
    progress?: number;
  }

  export {
    VideoThumbnail,
    VideoInfo,
    SummaryStatus,
    SummaryProcessingUpdate,
    SummaryResponse
  };
} 