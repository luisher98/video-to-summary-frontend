"use client";
import SummaryContent from "./SummaryContent";

import { useContextValue } from "../context/context";

export default function Summary() {
  const { state } = useContextValue();

  console.log(state);


  return (
    <>
      {state ? (
        <>
          <SummaryContent title={"Summary"} summary={state} />
        </>
      ) : null}
    </>
  );
}
