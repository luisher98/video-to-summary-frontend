type Summary = null | {
  content: string;
};

interface Thumbnail {
  url: string;
  width: number;
  height: number;
};

type VideoInfo = null | {
  id: string;
  title: string;
  thumbnail: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard: Thumbnail;
    maxres: Thumbnail;
  };
  channel: string;
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
};

interface SummaryContentProps {
  info: VideoInfo | null;
  summary: Summary | null;
}

interface VideoCardProps {
  videoInfo: VideoInfo | null;
}