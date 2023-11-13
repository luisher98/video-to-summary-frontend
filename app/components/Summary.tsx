"use client";

import { useVideoSummary } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo } = useVideoSummary();
  return (
    <>
      <div className="h-100">
        {summary ? (
          <>
            <VideoCard videoInfo={videoInfo} />
            <SummaryContent title={"Summary"} summary={summary} />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
}
