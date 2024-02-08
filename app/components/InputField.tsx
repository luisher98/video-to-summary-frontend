"use client";

import React, { useState } from "react";
import type { FormEvent } from "react";
import { useVideoContext } from "../context/VideoContext";

import Heading from "./Heading";
import getSummary from "../../lib/getVideoSummary";
import getInfo from "@/lib/getVideoInfo";
import Form from "./Form";
import getVideoStatus from "@/lib/getVideoStatus";

export default function InputField() {
  const [url, setUrl] = useState("");
  const {
    setSummary,
    setVideoInfo,
    setIsLoading,
    isLoading,
    numberOfWords,
    setNumberOfWords,
    setIsVideoUnavailable,
    isVideoUnavailable,
    isInputEmpty,
    setIsInputEmpty,
  } = useVideoContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!url) {
      setIsInputEmpty(true);
      setIsLoading(false);
      return;
    }
    try {
      const status = await getVideoStatus(url);
      if (!status) {
        setIsVideoUnavailable(true);
        setIsLoading(false);
        return;
      }

      const info = (await getInfo(url)) as VideoInfo;
      const summary = (await getSummary(url, numberOfWords)) as Summary;

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
            isVideoUnavailable={isVideoUnavailable}
            isInputEmpty={isInputEmpty}
          />
        </div>
      </div>
    </div>
  );
}
