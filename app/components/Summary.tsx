"use client";

import { useVideoSummary } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo, isLoading } = useVideoSummary();
  return (
    <>
      {summary ? (
        <>
          <VideoCard videoInfo={videoInfo?.info} />
          <SummaryContent title={`500 word summary of: '${videoInfo?.info.title}'`} summary={summary} />
        </>
      ) : ( isLoading ? <LoadingSpinner /> : null
        
      )}
    </>
  );
}
