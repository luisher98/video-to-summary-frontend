"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useVideoContext } from "../context/VideoContext";
import type { VideoContextState, SummaryProcessingUpdate } from "../../types";
import Heading from "./Heading";
import getSummary from "../../lib/getVideoSummary";
import getInfo from "@/lib/getVideoInfo";
import Form from "./Form";
import getVideoStatus from "@/lib/getVideoStatus";
import { getApiUrl } from "@/lib/env";

export default function InputField() {
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    isInputEmpty,
    setIsInputEmpty,
    setIsVideoUnavailable,
    isVideoUnavailable,
    setSummary,
    setVideoInfo,
    isLoading,
    setIsLoading,
    numberOfWords,
    setNumberOfWords,
  } = useVideoContext() as VideoContextState;

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setSummary([]);
      setVideoInfo(null);
      setIsInputEmpty(false);
      setIsVideoUnavailable(false);
      setSelectedFile(file);
      setUploadProgress(0);

      // Create FormData with the file
      const formData = new FormData();
      formData.append('video', file);

      // Create upload progress tracker
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      // Create a promise to handle the XHR request
      const uploadPromise = new Promise<Response>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const responseBody = xhr.response as string;
            resolve(new Response(responseBody, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: new Headers({
                'Content-Type': 'text/event-stream'
              })
            }));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));

        // Start the upload
        const API_URL = getApiUrl();
        xhr.open('POST', `${API_URL}/api/upload-summary-sse?words=${numberOfWords}`);
        xhr.setRequestHeader('Accept', 'text/event-stream');
        xhr.responseType = 'text';
        xhr.send(formData);
      });

      // Wait for upload to complete
      const response = await uploadPromise;

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader from response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.trim() === '' || !line.startsWith('data: ')) continue;
            
            try {
              const jsonStr = line.slice(6); // Remove 'data: ' prefix
              const update = JSON.parse(jsonStr) as SummaryProcessingUpdate;
              setSummary((prev: SummaryProcessingUpdate[]) => [...prev, update]);

              if (update.status === 'error') {
                setIsVideoUnavailable(true);
                break;
              }
            } catch {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      setIsVideoUnavailable(true);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setIsLoading(true);
    setSummary([]);
    setVideoInfo(null);
    setIsInputEmpty(false);
    setIsVideoUnavailable(false);

    if (!url) {
      setIsInputEmpty(true);
      setIsLoading(false);
      return;
    }

    try {
      // Check video status
      const status = await getVideoStatus(url);
      
      if (!status) {
        setIsVideoUnavailable(true);
        setIsLoading(false);
        return;
      }

      // Get video info
      const info = await getInfo(url);
      
      if (!info) {
        setIsVideoUnavailable(true);
        setIsLoading(false);
        return;
      }
      
      setVideoInfo(info);

      // Get summary
      for await (const update of getSummary(url, numberOfWords)) {
        setSummary((prev: SummaryProcessingUpdate[]) => [...prev, update]);
        
        if (update.status === 'error') {
          setIsVideoUnavailable(true);
          break;
        }
      }
    } catch (error) {
      setIsVideoUnavailable(true);
    } finally {
      setIsLoading(false);
      setUrl("");
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <Heading />
          <Form
            isInputEmpty={isInputEmpty}
            isVideoUnavailable={isVideoUnavailable}
            isLoading={isLoading}
            numberOfWords={numberOfWords}
            setNumberOfWords={setNumberOfWords}
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            onFileSelect={handleFileUpload}
            uploadProgress={uploadProgress}
          />
        </div>
      </div>
    </div>
  );
}
