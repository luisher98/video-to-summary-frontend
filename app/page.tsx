import DarkModeSwitch from "./components/DarkModeSwitch";
import Layout from "./components/Layout";
import InputField from "./components/InputField";
import VideoCard from "./components/VideoCard";
import Summary from "./components/Summary";

import { VideoContextProvider } from "./context/VideoContext";

export const metadata = {
  title: "Tube Summary",
  description:
    "A text summary generator for youtube videos created by Luis Hernández",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Home() {
  return (
    <>
      <Layout>
        <DarkModeSwitch />
        <VideoContextProvider>
          <InputField />
          <VideoCard />
          <Summary />
        </VideoContextProvider>
      </Layout>
    </>
  );
}
