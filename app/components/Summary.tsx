"use client";

import { useVideoContext } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Summary() {
  const { summary, videoInfo, isLoading, resetStates } = useVideoContext();

  const lastSummaryItem = summary[summary.length - 1];
  const loadingMessage = lastSummaryItem?.message ?? "Sending information...";

  if (lastSummaryItem?.status === "done") {
    return (
      <div className="space-y-8">
        {videoInfo && <VideoCard videoInfo={videoInfo} />}
        <SummaryContent info={videoInfo} summary={lastSummaryItem} />
        <div className="flex justify-center pb-8">
          <button
            onClick={resetStates}
            className="rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Generate Another Summary
          </button>
        </div>
      </div>
    );
  }

  const isProcessing = isLoading || (
    lastSummaryItem?.status && 
    ["pending", "processing", "uploading"].includes(lastSummaryItem.status)
  );

  if (isProcessing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner message={loadingMessage} />
      </div>
    );
  }

  return null;
}
