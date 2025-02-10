'use client';

import type { VideoInfo } from '@/types';
import type { SummaryResponse } from '@/types';
import { useVideoContext } from '@/app/context/VideoContext';

interface SummaryContentProps {
  info?: VideoInfo | null;
  summary: SummaryResponse;
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export default function SummaryContent({ info, summary }: SummaryContentProps) {
  const { fileInfo } = useVideoContext();
  
  if (!summary) return null;
  const { message: summaryText } = summary;
  
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <div className="max-w-2xl">
        <div className="space-y-5 md:space-y-8">
          <div className="space-y-3">
            {info?.title ? (
              <h2 className="text-2xl font-bold dark:text-white md:text-3xl">
                {info.title}
              </h2>
            ) : fileInfo && (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold dark:text-white md:text-3xl">
                  {fileInfo.name}
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Size: {formatFileSize(fileInfo.size)}</p>
                  <p>Type: {fileInfo.type}</p>
                </div>
              </div>
            )}
            <p className="text-lg text-gray-800 dark:text-gray-200">
              {summaryText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
