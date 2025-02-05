"use client";

import { useVideoContext } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo, isLoading } = useVideoContext();

  const lastSummaryItem = summary[summary.length - 1];
  const loadingMessage = lastSummaryItem?.message ?? "Sending information...";

  if (lastSummaryItem?.status === "done" && videoInfo) {
    return (
      <>
        <VideoCard videoInfo={videoInfo} />
        <SummaryContent info={videoInfo} summary={lastSummaryItem} />
      </>
    );
  }

  if (isLoading || lastSummaryItem?.status === "pending") {
    return <LoadingSpinner message={loadingMessage} />;
  }

  return null;
}
