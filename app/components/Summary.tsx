"use client";

import { useVideoSummary } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo, isLoading } = useVideoSummary();

  return (
    <>
      {summary && videoInfo ? (
        <>
          <VideoCard videoInfo={videoInfo} />
          <SummaryContent info={videoInfo} summary={summary} />
        </>
      ) : isLoading ? (
        <LoadingSpinner />
      ) : null}
    </>
  );
}
