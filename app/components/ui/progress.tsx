"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
        className
      )}
    >
      <div
        className="h-full w-full flex-1 bg-blue-500 transition-all dark:bg-blue-400"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  )
);

Progress.displayName = "Progress";

export { Progress }; 