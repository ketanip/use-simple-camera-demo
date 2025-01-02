"use client";
import { useSimpleCamera } from "use-simple-camera";
import React, { createContext, useEffect, useState } from "react";

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

  const [videoID, setVideoID] = useState<string>("");
  const [audioID, setAudioID] = useState<string>("");

  useEffect(() => {
    const setDefaultAudioAndVideoIDs = () => {
      if (hook.videoDevicesIDs.length > 0 && videoID === "") {
        setVideoID(hook.videoDevicesIDs[0].id);
      }
      if (hook.audioDevicesIDs.length > 0 && audioID === "") {
        setAudioID(hook.audioDevicesIDs[0].id);
      }
    };
    setDefaultAudioAndVideoIDs();
    return () => {};
  }, [hook.videoDevicesIDs, hook.audioDevicesIDs]);

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
