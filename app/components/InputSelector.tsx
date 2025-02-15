'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useVideoContext } from '@/app/context/VideoContext';
import Form from './Form';
import FileUploadForm from './FileUploadForm';
import type { SummaryProcessingUpdate, VideoInfo } from '@/types';
import { getApiUrl } from '@/lib/env';

type InputType = 'url' | 'file';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export default function InputSelector() {
  const [inputType, setInputType] = useState<InputType>('url');
  const {
    isInputEmpty,
    setIsInputEmpty,
    isVideoUnavailable,
    setIsVideoUnavailable,
    isLoading,
    setIsLoading,
    numberOfWords,
    setNumberOfWords,
    url,
    setUrl,
    setSummary,
    setVideoInfo,
    summary,
  } = useVideoContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setIsInputEmpty(true);
      return;
    }
    setIsInputEmpty(false);
    setIsLoading(true);
    setIsVideoUnavailable(false);
    setSummary([]);
    setVideoInfo(null);

    try {
      const API_URL = getApiUrl();
      
      // First fetch video info
      const infoResponse = await fetch(`${API_URL}/api/video/metadata?url=${encodeURIComponent(url)}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!infoResponse.ok) {
        throw new Error('Failed to fetch video info');
      }

      const infoText = await infoResponse.text();
      const infoData = JSON.parse(infoText) as ApiResponse<VideoInfo>;
      
      if (!infoData.success || !infoData.data) {
        throw new Error(infoData.message ?? 'Failed to fetch video info');
      }
      
      setVideoInfo(infoData.data);

      // Then start the summary stream
      const response = await fetch(
        `${API_URL}/api/youtube/summary/stream?url=${encodeURIComponent(url)}&words=${numberOfWords}`,
        {
          headers: {
            'Accept': 'text/event-stream',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start summary generation');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader from response');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          const decodedValue = new TextDecoder().decode(value);
          const lines = decodedValue.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(5)) as SummaryProcessingUpdate;
              setSummary(prev => [...prev, data]);

              if (data.status === 'done' || data.status === 'error') {
                setIsLoading(false);
                if (data.status === 'error') {
                  setIsVideoUnavailable(true);
                  setVideoInfo(null);
                }
                return;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setIsVideoUnavailable(true);
      setVideoInfo(null);
    }
  };

  const lastSummaryItem = summary[summary.length - 1];
  const showInputForm = !isLoading && lastSummaryItem?.status !== 'done';

  if (!showInputForm) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Video Summarizer
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Get concise, accurate summaries of any video in seconds.
          {inputType === 'url' ? 
            " Just paste a YouTube URL and let AI do the magic." :
            " Upload your video and transform it into clear, readable text."}
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-6 flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              inputType === 'url'
                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            YouTube URL
          </button>
          <button
            type="button"
            onClick={() => setInputType('file')}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              inputType === 'file'
                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            Upload Video
          </button>
        </div>

        {inputType === 'url' ? (
          <Form
            isInputEmpty={isInputEmpty}
            isVideoUnavailable={isVideoUnavailable}
            isLoading={isLoading}
            numberOfWords={numberOfWords}
            setNumberOfWords={setNumberOfWords}
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
          />
        ) : (
          <FileUploadForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            numberOfWords={numberOfWords}
            setNumberOfWords={setNumberOfWords}
            setSummary={setSummary}
          />
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {inputType === 'url' ? 
              "Supports any public YouTube video. Summaries are generated using advanced AI." :
              "Supports MP4, WebM, and QuickTime videos up to 500MB. Your privacy is our priority."}
          </p>
        </div>
      </div>
    </div>
  );
} 