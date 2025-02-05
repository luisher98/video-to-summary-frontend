export type SetState<T> = (value: T | ((prev: T) => T)) => void;

export interface VideoContextState {
  isInputEmpty: boolean;
  setIsInputEmpty: SetState<boolean>;
  isVideoUnavailable: boolean;
  setIsVideoUnavailable: SetState<boolean>;
  summary: SummaryProcessingUpdate[];
  setSummary: SetState<SummaryProcessingUpdate[]>;
  videoInfo: VideoInfo | null;
  setVideoInfo: SetState<VideoInfo | null>;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  numberOfWords: number;
  setNumberOfWords: SetState<number>;
} 