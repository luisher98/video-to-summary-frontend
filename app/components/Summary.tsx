"use client";

import { useVideoContext } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo, isLoading } = useVideoContext();

  const lastSummaryItem = summary[summary.length - 1];
  const loadingMessage = lastSummaryItem ? lastSummaryItem.message : "Sending information.";
  return (
    <>
      {lastSummaryItem && lastSummaryItem.status === "done" && videoInfo ? (
        <>
          <VideoCard videoInfo={videoInfo} />
          <SummaryContent info={videoInfo} summary={lastSummaryItem} />
        </>
      ) : isLoading || (lastSummaryItem && lastSummaryItem.status === "pending") ? (
        <LoadingSpinner message={loadingMessage} />
      ) : null}
    </>
  );
}
