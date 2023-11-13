type VideoSummary = {
  summary: string;
};

type VideoInfo = {
  id: string;
  title: string;
  url: string;
  thumbnail: {
    url: string;
  };
  channel: {
    name: string;
    url: string;
  };
};

