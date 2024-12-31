"use client";
import { useSimpleCamera } from "use-simple-camera";
import React, { createContext, useState } from "react";

interface ContextData {
  hook: ReturnType<typeof useSimpleCamera>;
  videoID: string;
  audioID: string;
  setVideoID: React.Dispatch<React.SetStateAction<string>>;
  setAudioID: React.Dispatch<React.SetStateAction<string>>;
}

export const HookContext = createContext<ContextData | null>(null);

interface Props {
  children: React.ReactNode;
}

const HookContextProvider: React.FC<Props> = ({ children }) => {
  const hook = useSimpleCamera();
  const [videoID, setVideoID] = useState<string>("default");
  const [audioID, setAudioID] = useState<string>("default");
  return (
    <HookContext.Provider
      value={{
        hook,
        videoID,
        audioID,
        setVideoID,
        setAudioID,
      }}
    >
      {children}
    </HookContext.Provider>
  );
};

export default HookContextProvider;
