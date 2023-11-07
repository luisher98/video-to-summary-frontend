import Head from "next/head";
import DarkModeSwitch from "./components/DarkModeSwitch";
import Layout from "./components/Layout";
import InputField from "./components/InputField";
import VideoCard from "./components/VideoCard";
import Summary from "./components/Summary";

import { ContextProvider } from "./context/Context";

export default function Home() {
  return (
    <>
      <Head>
        <title>TubeSummary</title>
        <meta
          name="description"
          content="A text summary generator for youtube videos created by Luis Hernández"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <DarkModeSwitch />
        <ContextProvider>
          <InputField />
          <VideoCard />
          <Summary />
        </ContextProvider>
      </Layout>
    </>
  );
}
