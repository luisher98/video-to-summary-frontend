"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { VideoInfo, SummaryProcessingUpdate } from '@/types';

interface VideoContextState {
  isInputEmpty: boolean;
  setIsInputEmpty: (value: boolean) => void;
  isVideoUnavailable: boolean;
  setIsVideoUnavailable: (value: boolean) => void;
  summary: SummaryProcessingUpdate[];
  setSummary: (value: SummaryProcessingUpdate[] | ((prev: SummaryProcessingUpdate[]) => SummaryProcessingUpdate[])) => void;
  videoInfo: VideoInfo | null;
  setVideoInfo: (value: VideoInfo | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  numberOfWords: number;
  setNumberOfWords: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
  resetStates: () => void;
}

const VideoContext = createContext<VideoContextState | null>(null);

export function VideoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false);
  const [isVideoUnavailable, setIsVideoUnavailable] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryProcessingUpdate[]>([]);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [numberOfWords, setNumberOfWords] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const resetStates = useCallback(() => {
    setIsInputEmpty(false);
    setIsVideoUnavailable(false);
    setSummary([]);
    setVideoInfo(null);
    setIsLoading(false);
    setUrl('');
  }, []);

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
        url,
        setUrl,
        resetStates,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext(): VideoContextState {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoContextProvider");
  }
  return context;
}
