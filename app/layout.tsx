import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import HookContextProvider from "@/components/contexts/UseSimpleStateContext";
import MediaSourceSelection from "@/components/main/MediaSourceSelection";
import Navbar from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: "Demo for use-simple-camera",
  description:
    "An simple react app demonstrating features of use-simple-camera.",
};

const poppinsFonts = Poppins({
  weight: ["400"],
  style: "normal",
  subsets: ["latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsFonts.className} bg-gray-50 min-h-screen`}>
        <HookContextProvider>
          <div className="md:max-w-7xl mx-auto py-4 flex flex-col gap-6 px-2">
            {/* Navbar - Logo, Github Link, NPM.js Link */}
            <Navbar />

            {/* Controls - start/stop camera <-> select streams */}
            <MediaSourceSelection />

            {/* Main Body */}
            {children}
          </div>
        </HookContextProvider>
      </body>
    </html>
  );
}
