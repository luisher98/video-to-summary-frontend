import DarkModeSwitch from "./components/DarkModeSwitch";
import Footer from "./components/Footer";
import InputSelector from "./components/InputSelector";
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
    <div className="flex min-h-screen flex-col">
      <div className="flex-none">
        <DarkModeSwitch />
      </div>
      <main className="flex-grow">
        <VideoContextProvider>
          <InputSelector />
          <Summary />
        </VideoContextProvider>
      </main>
      <Footer />
    </div>
  );
}
