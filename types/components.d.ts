import type { VideoInfo, SummaryProcessingUpdate } from './';

export interface FormProps {
  isInputEmpty: boolean;
  isVideoUnavailable: boolean;
  isLoading: boolean;
  numberOfWords: number;
  setNumberOfWords: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onFileSelect?: (file: File) => Promise<void>;
  uploadProgress?: number;
}

export interface FileUploadFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  numberOfWords: number;
  setNumberOfWords: (value: number) => void;
  setSummary: (value: SummaryProcessingUpdate[] | ((prev: SummaryProcessingUpdate[]) => SummaryProcessingUpdate[])) => void;
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