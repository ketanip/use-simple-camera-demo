/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useSimpleCamera } from "@/hooks/useSimpleCamera";
import { useRef, useState } from "react";

export default function Home() {
  const [imageURL, setImageURL] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLVideoElement>(null);
  const [videoRecodingID, setVideoRecordingID] = useState<string>("");

  const {
    permissionAcquired,
    acquirePermissions,
    isCameraActive,
    captureImage,
    startCamera,
    stopCamera,
    stopVideoRecording,
    recordVideo,
    downloadRecordedVideo,
    getVideoStream,
    videoDevicesIDs,
    audioDevicesIDs,
  } = useSimpleCamera();

  const captureImageLocal = async () => {
    setImageURL(await captureImage());
    console.log(imageURL);
  };

  const startPlayingVideo = async () => {
    const videoAndAudioSource = await getVideoStream({
      audioID: "default",
      videoID: "default",
    });
    if (videoRef.current) {
      videoRef.current.srcObject = videoAndAudioSource;
      videoRef.current.play();
    }
  };

  const stopPlayingVideo = async () => {
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startPlayingAudio = async () => {
    const videoAndAudioSource = await getVideoStream({
      audioID: "default",
      videoID: "none",
    });
    if (audioRef.current) {
      audioRef.current.srcObject = videoAndAudioSource;
      audioRef.current.play();
    }
  };

  const stopPlayingAudio = async () => {
    if (audioRef.current) audioRef.current.srcObject = null;
  };

  return (
    <div className="max-w-7xl mx-auto mt-20">
      <div className="grid grid-cols-3 gap-2">
        <div
          className={
            "mb-4 py-4  text-center font-semibold " +
            (permissionAcquired ? "bg-green-200" : "bg-red-200")
          }
        >
          Permissions Acquired: {permissionAcquired ? "TRUE" : "FALSE"}
        </div>

        <div
          className={
            "mb-4 py-4  text-center font-semibold " +
            (isCameraActive ? "bg-green-200" : "bg-red-200")
          }
        >
          Camera Active: {isCameraActive ? "TRUE" : "FALSE"}
        </div>

        <div
          className={
            "mb-4 py-4  text-center font-semibold bg-violet-200" 
          }
        >
          Video Recoding ID : {videoRecodingID ? videoRecodingID : "NO VIDEO RECORDING ID"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="flex flex-col">
          <label className="font-semibold">Select Camera ID</label>
          <select
            name="active_video_id"
            id="active_video_id"
            className="p-2 rounded"
          >
            {videoDevicesIDs.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Select Audio Device ID</label>
          <select
            name="active_audio_id"
            id="active_audio_id"
            className="p-2 rounded"
          >
            {audioDevicesIDs.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Enter Video ID</label>
          <input
            type="text"
            name="video_id"
            id="video_id"
            className="p-2 rounded border"
            onChange={e => setVideoRecordingID(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2  gap-4 ">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={(e) => acquirePermissions()}
            className="bg-gray-300 px-6 py-2"
          >
            Ask for permission
          </button>
          <button
            onClick={(e) => startCamera()}
            className="bg-gray-300 px-6 py-2"
          >
            Start Camera
          </button>
          <button
            onClick={(e) => stopCamera()}
            className="bg-gray-300 px-6 py-2"
          >
            Stop Camera
          </button>
          <button onClick={captureImageLocal} className="bg-gray-300 px-6 py-2">
            Capture Image
          </button>
          <button
            onClick={(e) => recordVideo(videoRecodingID)}
            className="bg-gray-300 px-6 py-2"
          >
            Start Video Recoding
          </button>
          <button
            onClick={(e) => stopVideoRecording()}
            className="bg-gray-300 px-6 py-2"
          >
            Stop Video Recording
          </button>
          <button
            onClick={(e) => downloadRecordedVideo(videoRecodingID, videoRecodingID)}
            className="bg-gray-300 px-6 py-2"
          >
            Download video
          </button>
          <button
            onClick={(e) => startPlayingVideo()}
            className="bg-gray-300 px-6 py-2"
          >
            Start Video Feed
          </button>

          <button
            onClick={(e) => stopPlayingVideo()}
            className="bg-gray-300 px-6 py-2"
          >
            Stop Video Feed
          </button>

          <button
            onClick={(e) => startPlayingAudio()}
            className="bg-gray-300 px-6 py-2"
          >
            Start Audio Feed
          </button>

          <button
            onClick={(e) => stopPlayingAudio()}
            className="bg-gray-300 px-6 py-2"
          >
            Stop Audio Feed
          </button>
        </div>

        {/* <video  src={mediaStream.}/> */}

        {imageURL && (
          <img
            src={imageURL}
            alt=""
            className="min-h-52 min-w-full bg-gray-50"
          />
        )}

        {videoRef && <video ref={videoRef} controls />}
        {audioRef && <audio ref={audioRef} controls />}
      </div>
    </div>
  );
}
