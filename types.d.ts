type Summary = [] | {
  status: string;
  message: string;
};

interface Thumbnail {
  url: string;
  width: number;
  height: number;
};

type VideoInfo = null | {
  id: string;
  title: string;
  thumbnail: Thumbnail;
  channel: string;
  description: string;
};

type VideoContext = {
  summary: Summary;
  setSummary: React.Dispatch<React.SetStateAction<Summary>>;
  videoInfo: VideoInfo;
  setVideoInfo: React.Dispatch<React.SetStateAction<VideoInfo>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfWords: number;
  setNumberOfWords: React.Dispatch<React.SetStateAction<number>>;
};

type FormProps = {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  numberOfWords: number;
  setNumberOfWords: React.Dispatch<React.SetStateAction<number>>;
  isVideoUnavailable: boolean;
  isInputEmpty: boolean;
};

interface SummaryContentProps {
  info: VideoInfo | null;
  summary: Summary | null;
}

interface VideoCardProps {
  videoInfo: VideoInfo | null;
}

interface SummaryProcessingUpdate {
  status: string;
  message: string;
}