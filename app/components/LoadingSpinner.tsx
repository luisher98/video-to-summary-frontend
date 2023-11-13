import React from "react";

export default function LoadingSpinner() {
  return (
    <>
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
        role="status"
        aria-label="loading"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </>
  );
}
