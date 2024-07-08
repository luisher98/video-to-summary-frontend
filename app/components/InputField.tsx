"use client";

import { useState } from "react";
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

      setVideoInfo(info);

      for await (const chunk of getSummary(url, numberOfWords)) {
        try {
          const jsonString = chunk.match(/\{([^}]+)\}/g)[0];
          const update = JSON.parse(jsonString.replace(/\\/g, ""));
          setSummary((prev) => [...prev, update]);
        } catch (error) {
          console.warn("Failed to parse JSON:", error.message);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    } finally {
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
