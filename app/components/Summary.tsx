"use client";

import { useVideoSummary } from "@/app/context/VideoContext";
import SummaryContent from "./SummaryContent";

export default function Summary() {
  const { summary } = useVideoSummary();
  return (
    <>
      <SummaryContent title={"Summary"} summary={summary} />
    </>
  );
}
