'use client'

import { ContextProvider, useContextValue } from "../context/context";
import Heading from "./Heading";
import Form from "./Form";
import FetchSummary from "../utils/FetchSummary";

export default function InputField() {
  const { dispatch, url, setUrl, loading, setLoading } =
    useContextValue(ContextProvider);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const data = await FetchSummary(url);
      console.log(data);

      dispatch({ type: "SET_DATA", payload: data });
      setUrl("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <Heading />
          <Form url={url} setUrl={setUrl} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
