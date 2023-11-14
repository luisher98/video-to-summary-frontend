type Summary = null | {
  content: string;
};

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

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

type Loading = {
  isLoading: boolean;
};
