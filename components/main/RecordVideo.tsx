"use client";

import React, { useContext, useRef, useState } from "react";
import { Button } from "../ui/button";
import { FaCameraRetro, FaDownload } from "react-icons/fa";
import { Separator } from "../ui/separator";
import { CiImageOn } from "react-icons/ci";
import { toast } from "react-toastify";
import { HookContext } from "../contexts/UseSimpleStateContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Download, PlayIcon } from "lucide-react";
import { IoVideocamOff, IoVideocam } from "react-icons/io5";

import { BiSolidVideos } from "react-icons/bi";

const RecordVideo = () => {
  // Getting access to the use-simple-camera hook.
  const context = useContext(HookContext);
  if (!context) return <></>;
  const { hook, videoID, audioID } = context;

  const [playVideoID, setPlayVideoID] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [recordedVideos, setRecordedVideos] = useState<string[]>([]);
  const [activeVideoRecodingID, setActiveVideoRecodingID] = useState<
    string | null
  >(null);

  const startRecodingVideo = async () => {
    try {
      setPlayVideoID(null);
      if (!hook.isCameraActive) {
        toast(
          "Camera is active, please turn it on and select a valid camera for input."
        );
        return;
      }

      const videoAndAudioSource = await hook.getMediaStream({
        audioID,
        videoID,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = videoAndAudioSource;
        videoRef.current.play();
      }
      if (activeVideoRecodingID !== null) {
        if (recordedVideos.includes(activeVideoRecodingID))
          throw new Error(
            "Identifier specified for this video recoding is already in use."
          );
        else await hook.recordVideo(activeVideoRecodingID);
      } else toast("Please enter a valid identifier for the video recoding.");
    } catch (error: any) {
      toast(error.message);
    }
  };

  const stopRecordingVideo = async () => {
    if (!activeVideoRecodingID) {
      toast("No video recording in progress.");
      return;
    }
    videoRef.current = null;
    await hook.stopVideoRecording();
  };

  const handleVideoDownload = (id: string) => {
    const res = hook.videoProcessingStatus.find((item) => item.id === id);
    if (res && res.status == "ready")
      hook.downloadRecordedVideo(res.id, `${res.id}.webm`);
    else toast("We are working to process your video. 😃");
  };

  const playVideo = (id: string) => {
    const res = hook.videoProcessingStatus.find((item) => item.id === id);
    if (res && res.status == "ready") setPlayVideoID(id);
    else toast("We are working to process your video. 😃");
  };

  return (
    <div className="grid md:grid-cols-4 gap-4 min-h-[85vh] bg-white my-auto border rounded-lg md:px-12 py-8">
      <div className="col-span-3 border-r border-gray-300 min-h-max p-4  flex">
        {playVideoID === null && hook.isCameraActive && videoRef && (
          <video
            ref={videoRef}
            className="mx-auto my-auto rounded shadow"
            controls
          />
        )}
        {playVideoID !== null && !hook.videoRecodingInProgress && (
          <video
            src={hook.getRecordedVideoURL(playVideoID)}
            className="mx-auto my-auto rounded shadow"
            controls
          />
        )}
      </div>

      <div className="flex flex-col gap-4 pl-4">
        {/* Main Components. */}
        <h4 className="text-2xl font-semibold">Record Video</h4>
        <p>
          We will be using{" "}
          <span className="font-mono bg-gray-50 p-0.5">
            getMediaStream, downloadRecordedVideo, getRecordedVideoBlob,
            stopVideoRecording, recordVideo
          </span>{" "}
          function of{" "}
          <span className="font-mono bg-gray-50 p-0.5">use-simple-camera</span>{" "}
          function .
        </p>

        <div>
          <Label>Video Identifier</Label>
          <Input
            type="text"
            placeholder="Enter name for the video."
            onChange={(e) => setActiveVideoRecodingID(e.target.value)}
          />
        </div>

        {!hook.videoRecodingInProgress ? (
          <Button
            className="bg-green-500 hover:bg-green-400 text-white"
            onClick={startRecodingVideo}
          >
            <IoVideocam />
            Start Recording Video
          </Button>
        ) : (
          <Button
            className="bg-red-500 hover:bg-red-400 text-white"
            onClick={stopRecordingVideo}
          >
            <IoVideocamOff />
            Stop Recording Video
          </Button>
        )}

        <Separator />

        {/* Recorded Videos */}
        <h6 className="font-semibold">Recoded Videos</h6>
        <div className="flex flex-col gap-2">
          {hook.videoProcessingStatus.length > 0 ? (
            hook.videoProcessingStatus.map((item, index) => (
              <div
                key={`video-${item.id}`}
                className="flex items-center border rounded-lg pl-3 "
              >
                <span className="flex-1">{item.id}</span>
                <Button
                  onClick={() => handleVideoDownload(item.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Download />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playVideo(item.id)}
                >
                  <PlayIcon />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-nowrap flex flex-col gap-2  mx-auto my-auto pt-8 text-gray-600">
              <div className="mx-auto">
                <BiSolidVideos className="text-2xl" />
              </div>
              <span>Record videos to get started.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordVideo;
