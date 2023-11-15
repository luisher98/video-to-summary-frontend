"use client";

import React, { useState } from "react";
import { useVideoSummary } from "../context/VideoContext";

import Heading from "./Heading";
import getSummary from "../../lib/getVideoSummary";
import getInfo from "@/lib/getVideoInfo";
import Form from "./Form";

export default function InputField() {
  const [url, setUrl] = useState("");
  const {
    setSummary,
    setVideoInfo,
    setIsLoading,
    isLoading,
    numberOfWords,
    setNumberOfWords,
  } = useVideoSummary();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const info: VideoInfo = await getInfo(url);
      const summary: Summary = await getSummary(url, numberOfWords);

      setSummary(summary);
      setVideoInfo(info);
    } catch (error) {
      console.error(error);
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
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            numberOfWords={numberOfWords}
            setNumberOfWords={setNumberOfWords}
          />
        </div>
      </div>
    </div>
  );
}
