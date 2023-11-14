"use client";

import React, { useState } from "react";
import { useVideoSummary } from "../context/VideoContext";

import Heading from "./Heading";
import getSummary from "../../lib/getVideoSummary";
import getInfo from "@/lib/getVideoInfo";

export default function InputField() {
  const [url, setUrl] = useState("");
  const { setSummary, setVideoInfo, setIsLoading, isLoading } = useVideoSummary();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const info: VideoInfo = await getInfo(url);
      const summary: Summary = await getSummary(url);

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
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <Heading />
          <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
            <form onSubmit={handleSubmit}>
              <div className="relative z-10 flex space-x-3 rounded-lg border bg-white p-3 shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/[.2]">
                <div className="flex-[1_0_0%]">
                  <label
                    htmlFor="hs-search-article-1"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    <span className="sr-only">
                      https://www.youtube.com/watch?v=aXvDEmo6uS4
                    </span>
                  </label>
                  <input
                    type="text"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="block w-full rounded-md border-transparent p-3 dark:bg-gray-800 dark:text-gray-400"
                    placeholder=""
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex-[0_0_auto]">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 p-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    href="#"
                    type="submit"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
