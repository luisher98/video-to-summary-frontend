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

export default function InputField() {
  const [url, setUrl] = useState("");

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
          />
        </div>
      </div>
    </div>
  );
}
