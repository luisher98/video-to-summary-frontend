type Summary = SummaryProcessingUpdate[];

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

type VideoInfo = null | {
  id: string;
  title: string;
  thumbnail: Thumbnail;
  channel: string;
  description: string;
};

type VideoContext = {
  isInputEmpty: boolean;
  setIsInputEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoUnavailable: boolean;
  setIsVideoUnavailable: React.Dispatch<React.SetStateAction<boolean>>;
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
  summary: SummaryProcessingUpdate | null;
}

interface VideoCardProps {
  videoInfo: VideoInfo | null;
}

interface SummaryProcessingUpdate {
  status: "done" | "pending" | "error";
  message: string;
}