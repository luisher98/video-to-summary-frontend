"use client";

import React, { createContext, useContext, useState } from "react";

const VideoContext = createContext<VideoContext | null>(null);

export function VideoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false);
  const [isVideoUnavailable, setIsVideoUnavailable] = useState<boolean>(false);
  const [summary, setSummary] = useState<Summary>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>(null);
  const [numberOfWords, setNumberOfWords] = useState<number>(100);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <VideoContext.Provider
      value={{
        isInputEmpty,
        setIsInputEmpty,
        isVideoUnavailable,
        setIsVideoUnavailable,
        summary,
        setSummary,
        videoInfo,
        setVideoInfo,
        isLoading,
        setIsLoading,
        numberOfWords,
        setNumberOfWords,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useSummary must be used within a VideoContextProvider");
  }
  return context;
}
