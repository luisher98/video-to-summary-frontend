"use client";

import { useVideoContext } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo, isLoading } = useVideoContext();
  console.log("summary: ", summary);

  const lastSummaryItem = summary[summary.length - 1];
  return (
    <>
      {lastSummaryItem && lastSummaryItem.status === "done" && videoInfo ? (
        <>
          <VideoCard videoInfo={videoInfo} />
          <SummaryContent info={videoInfo} summary={lastSummaryItem.message} />
        </>
      ) : isLoading || (lastSummaryItem && lastSummaryItem.status === "pending") ? (
        <LoadingSpinner status={lastSummaryItem ? lastSummaryItem.message : "Loading..."} />
      ) : null}
    </>
  );
}
