'use client'
import SummaryContent from "./SummaryContent";


import { useContextValue } from "../context/context";

export default function Summary() {
  const { state } = useContextValue();
  return (
    <>
      <SummaryContent
        title={"Summary"}
        summary={"state.data"}
      />
    </>
  );
}
