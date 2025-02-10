'use client';

import { useState } from 'react';
import { cn, validateVideoFile } from '@/lib/utils';
import { Progress } from './ui/progress';
import type { SummaryProcessingUpdate, SummaryResponse } from '@/types';
import { useVideoContext } from '@/app/context/VideoContext';

interface FileUploadFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  numberOfWords: number;
  setNumberOfWords: (value: number) => void;
  setSummary: (value: SummaryProcessingUpdate[] | ((prev: SummaryProcessingUpdate[]) => SummaryProcessingUpdate[])) => void;
}

interface UploadUrlResponse {
  url: string;
  fileId: string;
  blobName: string;
}

interface UploadUrlApiResponse {
  success: boolean;
  data: UploadUrlResponse;
  message?: string;
}

interface ErrorData {
  message?: string;
  error?: string;
}

const MAX_LOCAL_FILE_SIZE = 200 * 1024 * 1024; // 200MB to match API memory limit
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB absolute maximum
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export default function FileUploadForm({
  isLoading,
  setIsLoading,
  numberOfWords,
  setNumberOfWords,
  setSummary,
}: FileUploadFormProps) {
  const { setFileInfo } = useVideoContext();
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ blobName: string; fileId: string } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof TypeError) {
      setValidationError('Network error. Please check your connection.');
    } else if (error instanceof Response) {
      setValidationError(`Server error: ${error.statusText}`);
    } else {
      setValidationError('An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
    setUploadProgress(0);
  };

  const uploadToAzure = async (file: File, url: string): Promise<void> => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.setRequestHeader('Content-Type', file.type);

      return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.floor((e.loaded / e.total) * 80) + 10;
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(90);
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(file);
      });
    } catch (error) {
      throw new Error('Failed to upload to Azure');
    }
  };

  const handleUpload = async (file: File) => {
    setValidationError(null);
    setShowGenerateButton(false);
    setUploadedFileInfo(null);
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setValidationError(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Invalid file type. Supported types: MP4, WebM, QuickTime');
      return;
    }

    const error = validateVideoFile(file);
    if (error) {
      setValidationError(error.message);
      return;
    }

    setIsLoading(true);
    setSummary([]);
    setUploadProgress(0);

    try {
      if (file.size > MAX_LOCAL_FILE_SIZE) {
        // Large file upload flow
        setUploadProgress(5); // Starting upload process
        
        const urlResponse = await fetch('/api/upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
          }),
        });

        if (!urlResponse.ok) {
          const errorData = (await urlResponse.json()) as ErrorData;
          throw new Error(errorData.message ?? errorData.error ?? 'Failed to get upload URL');
        }

        const urlData = await urlResponse.json() as UploadUrlApiResponse;
        
        // Upload to Azure with progress tracking
        await uploadToAzure(file, urlData.data.url);
        
        // Save file info for later processing
        setUploadedFileInfo({
          blobName: urlData.data.blobName,
          fileId: urlData.data.fileId,
        });
        setShowGenerateButton(true);
        setIsLoading(false);
      } else {
        // Small file upload flow
        const formData = new FormData();
        // Preserve the original file type if it's valid
        const fileType = ALLOWED_TYPES.includes(file.type) ? file.type : 'video/mp4';
        const fileWithType = new File([file], file.name, { type: fileType });
        formData.append('video', fileWithType);

        // Set file information
        setFileInfo({
          name: file.name,
          size: file.size,
          type: fileType
        });

        console.log('Starting file upload with words:', numberOfWords);
        const response = await fetch(`/api/upload-summary-sse?words=${numberOfWords}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          console.error('Upload failed with status:', response.status);
          throw new Error('Upload failed');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get reader from response');
        }

        console.log('Starting to read SSE stream');
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('SSE stream ended');
            break;
          }

          if (value) {
            const decodedValue = new TextDecoder().decode(value);
            console.log('Received SSE chunk:', decodedValue);
            const lines = decodedValue.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(5)) as SummaryResponse;
                  console.log('Parsed SSE message:', data);
                  
                  // Handle progress updates
                  if (data.progress) {
                    console.log('Updating progress:', data.progress);
                    void setUploadProgress(data.progress);
                  }

                  // Add all updates to the summary array
                  console.log('Adding to summary:', data);
                  void setSummary(prev => {
                    console.log('Previous summary:', prev);
                    return [...prev, data];
                  });

                  // Handle completion or error
                  if (data.status === 'done') {
                    console.log('Processing completed with summary:', data.message);
                    setIsLoading(false);
                    return;
                  } else if (data.status === 'error') {
                    console.error('Processing error:', data.message);
                    setIsLoading(false);
                    return;
                  }
                } catch (parseError) {
                  console.error('Error parsing SSE message:', parseError, 'Raw line:', line);
                  continue;
                }
              }
            }
          }
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleGenerateSummary = async () => {
    if (!uploadedFileInfo) return;

    setIsLoading(true);
    setSummary([]);
    setUploadProgress(0);

    try {
      const response = await fetch('/api/upload-summary-azure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...uploadedFileInfo,
          words: numberOfWords,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
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
              const data = JSON.parse(line.slice(5)) as SummaryResponse;
              void setSummary(prev => [...prev, data]);

              if (data.status === 'done' || data.status === 'error') {
                setIsLoading(false);
                return;
              }

              if (data.progress) {
                void setUploadProgress(data.progress);
              }
            }
          }
        }
      }
    } catch (error) {
      setValidationError('Failed to generate summary. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  };

  return (
    <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
      <div
        className={cn(
          "relative z-10 rounded-lg border bg-white p-3 shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/[.2]",
          validationError && "border-red-500 dark:border-red-500",
          dragActive && "border-blue-500 dark:border-blue-500"
        )}
      >
        <div
          className="flex min-h-[200px] flex-col items-center justify-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="video-upload"
            className="hidden"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <label
            htmlFor="video-upload"
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2",
              isLoading && "pointer-events-none opacity-50"
            )}
          >
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {dragActive
                ? "Drop your video here"
                : "Drag & drop your video here or click to browse"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Supported formats: MP4, WebM, QuickTime (max 500MB)
            </span>
          </label>

          {/* Upload Progress */}
          {isLoading && uploadProgress > 0 && (
            <div className="mt-4 w-full max-w-xs">
              <Progress value={uploadProgress} className="h-1" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {showGenerateButton ? "Processing" : "Uploading"}... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Generate Summary Button */}
          {showGenerateButton && !isLoading && (
            <button
              onClick={() => void handleGenerateSummary()}
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Generate Summary
            </button>
          )}
        </div>
      </div>

      {validationError && (
        <p className="mt-2 text-left text-xs text-red-600 dark:text-red-600">
          <span className="font-medium">Error:</span> {validationError}
        </p>
      )}

      <label
        htmlFor="minmax-Words"
        className="mt-4 block text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Words: {numberOfWords}
      </label>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        id="minmax-Words"
        type="range"
        min="100"
        max="500"
        step="100"
        value={numberOfWords}
        onChange={(e) => setNumberOfWords(Number(e.target.value))}
        disabled={isLoading}
      />
    </div>
  );
} 