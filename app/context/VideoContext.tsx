"use client";

import React, { createContext, useContext, useState } from "react";

type VideoContext = {
  summary: Summary;
  setSummary: React.Dispatch<React.SetStateAction<Summary>>;
  videoInfo: VideoInfo;
  setVideoInfo: React.Dispatch<React.SetStateAction<VideoInfo>>;
  isLoading: Loading;
  setIsLoading: React.Dispatch<React.SetStateAction<Loading>>;
};

const VideoContext = createContext<VideoContext | null>(null);

export function VideoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [summary, setSummary] = useState<Summary>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>(null);

  const [isLoading, setIsLoading] = useState<Loading>(false);

  return (
    <VideoContext.Provider
      value={{ summary, setSummary, videoInfo, setVideoInfo, isLoading, setIsLoading }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoSummary() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useSummary must be used within a VideoContextProvider");
  }
  return context;
}

export function useVideoInfo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoInfo must be used within a VideoContextProvider");
  }
  return context;
}
