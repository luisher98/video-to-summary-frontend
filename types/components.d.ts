import type { VideoInfo } from './video';
import type { SummaryProcessingUpdate } from './summary';

export interface FormProps {
  isInputEmpty: boolean;
  isVideoUnavailable: boolean;
  isLoading: boolean;
  numberOfWords: number;
  setNumberOfWords: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface VideoCardProps {
  videoInfo: VideoInfo | null;
}

export interface SummaryContentProps {
  info: VideoInfo;
  summary: SummaryProcessingUpdate;
}

export interface LoadingSpinnerProps {
  message: string;
} 