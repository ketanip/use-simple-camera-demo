"use client";

import { useContext } from "react";
import { HookContext } from "../contexts/UseSimpleStateContext";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const MediaSourceSelection = () => {
  // Getting access to the use-simple-camera hook.
  const context = useContext(HookContext);
  if (!context) return <></>;
  const { hook, setVideoID, setAudioID } = context;

  // If camera is not active.
  if (!hook.isCameraActive) return <></>;

  return (
    <div className="grid md:grid-cols-2 gap-4 bg-white px-4 py-4 rounded-lg border">
      {/* Video source */}
      <div className="flex items-center gap-4">
        <Label className="font-semibold text-nowrap">Video Source</Label>
        <Select onValueChange={(newVal) => setVideoID(newVal)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Video Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Turn Off</SelectItem>
            {hook.videoDevicesIDs.map((item) => (
              <SelectItem value={item.id} key={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audio source */}
      <div className="flex items-center gap-4">
        <Label className="font-semibold text-nowrap">Audio Source</Label>
        <Select onValueChange={(newVal) => setAudioID(newVal)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Audio Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Turn Off</SelectItem>
            {hook.audioDevicesIDs.map((item) => (
              <SelectItem value={item.id} key={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MediaSourceSelection;
