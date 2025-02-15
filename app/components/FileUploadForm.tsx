'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn, validateVideoFile } from '@/lib/utils';
import { Progress } from './ui/progress';
import type { SummaryProcessingUpdate, SummaryResponse } from '@/types';
import { useVideoContext } from '@/app/context/VideoContext';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { getUploadUrl } from '@/lib/api';
import { getApiUrl } from '@/lib/env';

interface FileUploadFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  numberOfWords: number;
  setNumberOfWords: (words: number) => void;
  setSummary: (summary: string) => void;
}

interface UploadUrlResponse {
  url: string;
  fileId: string;
  blobName: string;
}

interface ProcessingUpdate {
  status: 'pending' | 'done' | 'error';
  message: string;
  progress?: number;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
}

interface SSEData extends SummaryProcessingUpdate {
  progress: number;
}

const MAX_LOCAL_FILE_SIZE = 200 * 1024 * 1024; // 200MB to match API memory limit
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB absolute maximum
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export default function FileUploadForm({
  isLoading,
  setIsLoading,
  numberOfWords,
  setNumberOfWords,
  setSummary: _setSummary,
}: FileUploadFormProps) {
  const { setFileInfo, setSummary, summary } = useVideoContext();
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

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

  const uploadToAzure = async (file: File, url: string, retries = 3): Promise<void> => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-ms-version', '2020-04-08');
      xhr.withCredentials = false; // Important for CORS

      // Increase timeout to 2 minutes for larger files
      xhr.timeout = 120000; // 2 minutes

      return new Promise((resolve, reject) => {
        let lastProgress = 0;
        let uploadStartTime = Date.now();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const currentProgress = Math.floor((e.loaded / e.total) * 100);
            // Only update if progress has changed by at least 1%
            if (currentProgress > lastProgress) {
              lastProgress = currentProgress;
              setUploadProgress(Math.min(90, currentProgress));
              
              // Reset timeout if we're making progress
              uploadStartTime = Date.now();
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(90);
            resolve();
          } else {
            console.error('Upload failed with status:', xhr.status, xhr.statusText);
            console.error('Response:', xhr.responseText);
            const error = new Error(`Upload failed: ${xhr.status} - ${xhr.statusText}`);
            error.name = 'UploadError';
            reject(error);
          }
        };

        xhr.onerror = () => {
          const uploadTime = Date.now() - uploadStartTime;
          console.error('Network error during upload. XHR:', {
            readyState: xhr.readyState,
            status: xhr.status,
            responseText: xhr.responseText,
            uploadTime: `${uploadTime}ms`
          });
          
          if (retries > 0) {
            console.log(`Retrying upload, ${retries} attempts remaining`);
            // Add exponential backoff
            const backoffDelay = Math.min(1000 * Math.pow(2, 3 - retries), 10000);
            setTimeout(() => {
              uploadToAzure(file, url, retries - 1)
                .then(resolve)
                .catch(reject);
            }, backoffDelay);
          } else {
            const error = new Error('Network error during upload. Please check your connection and try again.');
            error.name = 'NetworkError';
            reject(error);
          }
        };

        xhr.ontimeout = () => {
          const uploadTime = Date.now() - uploadStartTime;
          console.error('Upload timed out after', uploadTime, 'ms');
          if (retries > 0) {
            console.log(`Retrying upload after timeout, ${retries} attempts remaining`);
            // Add exponential backoff
            const backoffDelay = Math.min(1000 * Math.pow(2, 3 - retries), 10000);
            setTimeout(() => {
              uploadToAzure(file, url, retries - 1)
                .then(resolve)
                .catch(reject);
            }, backoffDelay);
          } else {
            const error = new Error('Upload timed out after multiple attempts. Please try again.');
            error.name = 'TimeoutError';
            reject(error);
          }
        };

        try {
          xhr.send(file);
        } catch (sendError) {
          console.error('Error sending file:', sendError);
          reject(sendError);
        }
      });
    } catch (error) {
      console.error('Error in uploadToAzure:', error);
      throw error;
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);
      setValidationError(null); // Clear any previous errors

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Unsupported file type. Supported types: MP4, WebM, QuickTime');
      }

      // Get upload URL from azure storage
      const responseData = await getUploadUrl(file.name, file.size);

      if (!responseData.data?.url || !responseData.data?.fileId || !responseData.data?.blobName) {
        throw new Error('Invalid response from server');
      }

      // the response data is stored for referencing the file in the future
      const { url, fileId, blobName } = responseData.data;

      // Upload directly to Azure
      setUploadProgress(10);
      await uploadToAzure(file, url);

      // Start processing with SSE
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const API_URL = getApiUrl();
      // we pass to the server the reference to the blob name and the number of words
      const eventSource = new EventSource(`${API_URL}/api/azure/summary/stream?fileId=${fileId}&blobName=${blobName}&words=${numberOfWords}`);
      eventSourceRef.current = eventSource;

      let retryCount = 0;
      const maxRetries = 3;

      eventSource.onmessage = (event: MessageEvent<string>) => {
        try {
          const sseData = JSON.parse(event.data) as SSEData;
          console.log('Received SSE data:', sseData);
          
          if (sseData && typeof sseData === 'object') {
            if (sseData.status === 'error') {
              // Handle error before attempting to update summary
              setIsLoading(false);
              eventSource.close();
              eventSourceRef.current = null;
              toast.error(sseData.message || 'Processing failed');
              return;
            }
            
            // Update the summary in the VideoContext
            setSummary(prev => [...prev, sseData]);
            
            if (sseData.status === 'done') {
              setIsLoading(false);
              eventSource.close();
              eventSourceRef.current = null;
            } else if ('progress' in sseData && typeof sseData.progress === 'number') {
              // Calculate total progress: 90% for upload + 10% for processing
              const processingProgress = sseData.progress * 0.1; // 10% of total
              setUploadProgress(Math.min(90 + processingProgress, 99)); // Never reach 100 until done
            }
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying SSE connection, attempt ${retryCount} of ${maxRetries}`);
          } else {
            eventSource.close();
            eventSourceRef.current = null;
            toast.error('Error processing video');
            setIsLoading(false);
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying SSE connection, attempt ${retryCount} of ${maxRetries}`);
        } else {
          setIsLoading(false);
          eventSource.close();
          eventSourceRef.current = null;
          toast.error('Error processing video');
        }
      };

      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        type: file.type
      };
      setFileInfo(fileInfo);

    } catch (error) {
      console.error('Upload error:', error);
      setIsLoading(false);
      setUploadProgress(0);
      
      let errorMessage = 'Failed to upload file';
      if (error instanceof Error) {
        switch (error.name) {
          case 'NetworkError':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          case 'TimeoutError':
            errorMessage = 'Upload timed out. Please try again.';
            break;
          case 'UploadError':
            errorMessage = `Upload failed: ${error.message}`;
            break;
          default:
            errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      void handleFileUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov']
    },
    maxFiles: 1
  });

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
          {...getRootProps()}
        >
          <input
            type="file"
            id="video-upload"
            className="hidden"
            accept="video/mp4,video/webm,video/quicktime"
            {...getInputProps()}
            disabled={isLoading}
          />
          <label
            htmlFor="video-upload"
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2",
              isLoading && "pointer-events-none opacity-50"
            )}
          >
            <FiUpload className="h-12 w-12 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {dragActive ? "Drop your video here" : "Drag & drop your video here or click to browse"}
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
                {uploadProgress >= 90 ? "Processing" : "Uploading"}... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Display progress and summary */}
      <div className="mt-4 space-y-4">
        {isLoading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {(summary.length > 0 && summary[summary.length - 1]?.message) ?? "Uploading..."}
            </p>
          </div>
        )}

        {!isLoading && summary.length > 0 && summary[summary.length - 1]?.status === 'done' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Summary:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {summary[summary.length - 1]?.message}
            </p>
          </div>
        )}

        {validationError && (
          <p className="text-red-500 text-sm">{validationError}</p>
        )}
      </div>

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